import { createMock } from '@golevelup/ts-jest';
import {
  Collection,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  DocEntity,
  OrgMemberEntity,
  OrganizationEntity,
  QnaEntity,
  TeamEntity,
  testDocDocParams1,
  testDocEntity1,
  testOrgMemberDocParams1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaDocParams1,
  testQnaEntity1,
  testTeamEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { solrOrgConfigset, solrOrgDictionaries } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  organizationSlugNotFound,
  organizationSlugTakenBadRequest,
  testCreateOrganizationDto1,
  testNow1,
  testUpdateOrganizationDto1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
import { OrganizationService } from './organization.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  OrganizationEntity: jest.fn(),
}));
const mockOrganizationEntity = OrganizationEntity as jest.Mock;

describe('OrganizationService', () => {
  let service: OrganizationService;
  let em: EntityManager;
  let txEm: EntityManager;
  let solrCli: SolrCli;
  let teamService: TeamService;

  beforeEach(async () => {
    txEm = createMock<EntityManager>({
      assign: jest.fn().mockReturnValue(testOrganizationEntity1),
    });

    const module = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testOrganizationEntity1),
            assign: jest.fn().mockResolvedValue(testOrganizationEntity1),
            transactional: jest.fn().mockImplementation(async (cb) => {
              return await cb(txEm);
            }),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            getAffectedPosts: jest.fn().mockResolvedValue({
              docs: [testDocEntity1],
              qnas: [testQnaEntity1],
            }),
          }),
        },
      ],
    }).compile();

    service = module.get(OrganizationService);
    em = module.get(EntityManager);
    solrCli = module.get(SolrCli);
    teamService = module.get(TeamService);

    jest.clearAllMocks();
    mockOrganizationEntity.mockReturnValue(testOrganizationEntity1);
    testOrganizationEntity1.members = createMock<Collection<OrgMemberEntity>>({
      getItems: jest.fn().mockReturnValue([testOrgMemberEntity1]),
    });

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(txEm).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(teamService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockOrganizationEntity).toHaveBeenCalledTimes(1);
      expect(mockOrganizationEntity).toHaveBeenCalledWith(
        testCreateOrganizationDto1.name,
        testCreateOrganizationDto1.slug,
        testCreateOrganizationDto1.upToDateDuration,
        testUserEntity1,
      );
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.persistAndFlush).toHaveBeenCalledWith(
        testOrganizationEntity1,
      );
    });

    it('should create an organization', async () => {
      await expect(
        service.create(testCreateOrganizationDto1, testUserEntity1),
      ).resolves.toEqual(testOrganizationEntity1);
      expect(solrCli.createCollection).toHaveBeenCalledTimes(1);
      expect(solrCli.createCollection).toHaveBeenCalledWith({
        name: testOrganizationEntity1.id,
        numShards: 1,
        config: solrOrgConfigset,
      });
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(testOrganizationEntity1.id, [
        testOrgMemberDocParams1,
      ]);
    });

    it('should throw a BadRequestException if name already exists', async () => {
      jest
        .spyOn(txEm, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(
        service.create(testCreateOrganizationDto1, testUserEntity1),
      ).rejects.toThrow(
        new BadRequestException(organizationSlugTakenBadRequest),
      );
    });
  });

  describe('hasOneBySlug', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(OrganizationEntity, {
        slug: testOrganizationEntity1.slug,
      });
    });

    it(`should return true if it's found`, async () => {
      await expect(
        service.hasOneBySlug(testOrganizationEntity1.slug),
      ).resolves.toBeTruthy();
    });

    it(`should return false if it can't be found`, async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.hasOneBySlug(testOrganizationEntity1.slug),
      ).resolves.toBeFalsy();
    });
  });

  describe('findOneBySlug', () => {
    beforeEach(() => {
      jest.spyOn(service, 'buildSuggesters');
    });

    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(OrganizationEntity, {
        slug: testOrganizationEntity1.slug,
      });
    });

    it('should find an organization', async () => {
      await expect(
        service.findOneBySlug(testOrganizationEntity1.slug),
      ).resolves.toEqual(testOrganizationEntity1);
      expect(service.buildSuggesters).not.toHaveBeenCalled();
    });

    it(`should build the suggester if it's been at least a day since last build`, async () => {
      const testOrganizationEntity2: OrganizationEntity = {
        ...testOrganizationEntity1,
        suggesterBuiltAt: dayjs(testNow1).subtract(1, 'day').toDate(),
      };
      jest.spyOn(em, 'findOne').mockResolvedValue(testOrganizationEntity2);
      jest.spyOn(em, 'assign').mockReturnValue(testOrganizationEntity2);
      await expect(
        service.findOneBySlug(testOrganizationEntity2.slug),
      ).resolves.toEqual(testOrganizationEntity2);
      expect(service.buildSuggesters).toHaveBeenCalledTimes(1);
      expect(service.buildSuggesters).toHaveBeenCalledWith(
        testOrganizationEntity2,
      );
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testOrganizationEntity2, {
        suggesterBuiltAt: testNow1,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if slug does not exist', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOneBySlug(testOrganizationEntity1.slug),
      ).rejects.toThrow(new NotFoundException(organizationSlugNotFound));
    });
  });

  describe('update', () => {
    const newDuration = dayjs.duration(
      testUpdateOrganizationDto1.upToDateDuration as string,
    );

    beforeEach(() => {
      jest
        .spyOn(service, 'getAffectedPosts')
        .mockResolvedValue({ docs: [testDocEntity1], qnas: [testQnaEntity1] });
    });

    afterEach(() => {
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledTimes(3);
      expect(txEm.assign).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testUpdateOrganizationDto1,
      );
      expect(txEm.assign).toHaveBeenCalledWith(testDocEntity1, {
        outOfDateAt: dayjs(testDocEntity1.markedUpToDateAt)
          .add(newDuration)
          .toDate(),
      });
      expect(txEm.assign).toHaveBeenCalledWith(testQnaEntity1, {
        outOfDateAt: dayjs(testQnaEntity1.markedUpToDateAt)
          .add(newDuration)
          .toDate(),
      });
      expect(service.getAffectedPosts).toHaveBeenCalledTimes(1);
      expect(service.getAffectedPosts).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testUpdateOrganizationDto1.upToDateDuration,
      );
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should update an organization', async () => {
      await expect(
        service.update(testOrganizationEntity1, testUpdateOrganizationDto1),
      ).resolves.toEqual(testOrganizationEntity1);

      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        [testDocDocParams1, testQnaDocParams1],
      );
    });

    it('should throw a BadRequestException if name already exists', async () => {
      jest
        .spyOn(em, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush')),
        );
      await expect(
        service.update(testOrganizationEntity1, testUpdateOrganizationDto1),
      ).rejects.toThrow(
        new BadRequestException(organizationSlugTakenBadRequest),
      );
    });
  });

  describe('delete', () => {
    it('should remove an organization', async () => {
      await expect(
        service.delete(testOrganizationEntity1),
      ).resolves.toBeUndefined();
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledWith(testOrganizationEntity1);
      expect(solrCli.deleteCollection).toHaveBeenCalledTimes(1);
      expect(solrCli.deleteCollection).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
      );
    });
  });

  describe('getAffectedPosts', () => {
    it('should find all child posts and upate their expirations', async () => {
      const newDurationStr = 'P1Y';
      jest
        .spyOn(em, 'find')
        .mockResolvedValueOnce([testTeamEntity1])
        .mockResolvedValueOnce([testDocEntity1])
        .mockResolvedValueOnce([testQnaEntity1]);
      await expect(
        service.getAffectedPosts(testOrganizationEntity1, newDurationStr),
      ).resolves.toEqual({
        docs: [testDocEntity1, testDocEntity1],
        qnas: [testQnaEntity1, testQnaEntity1],
      });

      expect(em.find).toHaveBeenCalledTimes(3);
      expect(em.find).toHaveBeenCalledWith(TeamEntity, {
        organization: testOrganizationEntity1,
        upToDateDuration: null,
      });
      expect(em.find).toHaveBeenCalledWith(DocEntity, {
        organization: testOrganizationEntity1,
        team: null,
        upToDateDuration: null,
      });
      expect(em.find).toHaveBeenCalledWith(QnaEntity, {
        organization: testOrganizationEntity1,
        team: null,
        upToDateDuration: null,
      });

      expect(teamService.getAffectedPosts).toHaveBeenCalledTimes(1);
      expect(teamService.getAffectedPosts).toHaveBeenCalledWith(
        testTeamEntity1,
        newDurationStr,
      );
    });
  });

  describe('buildSuggesters', () => {
    it('should call suggest with build parameter', async () => {
      await expect(
        service.buildSuggesters(testOrganizationEntity1),
      ).resolves.toBeUndefined();
      expect(solrCli.suggest).toHaveBeenCalledTimes(
        Object.values(solrOrgDictionaries).length,
      );
      Object.values(solrOrgDictionaries).forEach((dictionary) => {
        expect(solrCli.suggest).toHaveBeenCalledWith(
          testOrganizationEntity1.id,
          {
            params: { 'suggest.build': true, 'suggest.dictionary': dictionary },
          },
        );
      });
    });
  });
});
