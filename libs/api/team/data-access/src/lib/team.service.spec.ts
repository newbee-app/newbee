import { createMock } from '@golevelup/ts-jest';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DocEntity,
  QnaEntity,
  TeamEntity,
  testDocDocParams1,
  testDocEntity1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaDocParams1,
  testQnaEntity1,
  testTeamDocParams1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import {
  teamSlugNotFound,
  teamSlugTakenBadRequest,
  testCreateTeamDto1,
  testUpdateTeamDto1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
import { TeamService } from './team.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  TeamEntity: jest.fn(),
}));
const mockTeamEntity = TeamEntity as jest.Mock;

describe('TeamService', () => {
  let service: TeamService;
  let em: EntityManager;
  let txEm: EntityManager;
  let solrCli: SolrCli;

  beforeEach(async () => {
    txEm = createMock<EntityManager>({
      assign: jest.fn().mockReturnValue(testTeamEntity1),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testTeamEntity1),
            transactional: jest.fn().mockImplementation(async (cb) => {
              return await cb(txEm);
            }),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
      ],
    }).compile();

    service = module.get(TeamService);
    em = module.get(EntityManager);
    solrCli = module.get(SolrCli);

    jest.clearAllMocks();
    mockTeamEntity.mockReturnValue(testTeamEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('create', () => {
    it('should create a new team', async () => {
      await expect(
        service.create(testCreateTeamDto1, testOrgMemberEntity1),
      ).resolves.toEqual(testTeamEntity1);
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(mockTeamEntity).toHaveBeenCalledTimes(1);
      expect(mockTeamEntity).toHaveBeenCalledWith(
        testCreateTeamDto1.name,
        testCreateTeamDto1.slug,
        testCreateTeamDto1.upToDateDuration,
        testOrgMemberEntity1,
      );
      expect(txEm.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.persistAndFlush).toHaveBeenCalledWith(testTeamEntity1);
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testTeamDocParams1,
      );
    });

    it('should throw a BadRequestException if slug already exists', async () => {
      jest
        .spyOn(txEm, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(
        service.create(testCreateTeamDto1, testOrgMemberEntity1),
      ).rejects.toThrow(new BadRequestException(teamSlugTakenBadRequest));
    });
  });

  describe('hasOneByOrgAndSlug', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(TeamEntity, {
        organization: testOrganizationEntity1,
        slug: testTeamEntity1.slug,
      });
    });

    it(`should return true if it's found`, async () => {
      await expect(
        service.hasOneByOrgAndSlug(
          testOrganizationEntity1,
          testTeamEntity1.slug,
        ),
      ).resolves.toBeTruthy();
    });

    it(`should return false if it can't be found`, async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.hasOneByOrgAndSlug(
          testOrganizationEntity1,
          testTeamEntity1.slug,
        ),
      ).resolves.toBeFalsy();
    });
  });

  describe('findOneByOrgAndSlug', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(TeamEntity, {
        organization: testOrganizationEntity1,
        slug: testTeamEntity1.slug,
      });
    });

    it('should find a team by slug', async () => {
      await expect(
        service.findOneByOrgAndSlug(
          testOrganizationEntity1,
          testTeamEntity1.slug,
        ),
      ).resolves.toEqual(testTeamEntity1);
    });

    it('should throw a NotFoundException if slug does not exist', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOneByOrgAndSlug(
          testOrganizationEntity1,
          testTeamEntity1.slug,
        ),
      ).rejects.toThrow(new NotFoundException(teamSlugNotFound));
    });
  });

  describe('update', () => {
    const newDuration = dayjs.duration(
      testUpdateTeamDto1.upToDateDuration as string,
    );

    beforeEach(() => {
      jest.spyOn(service, 'getAffectedPosts').mockResolvedValue({
        docs: [testDocEntity1],
        qnas: [testQnaEntity1],
      });
    });

    afterEach(() => {
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledTimes(3);
      expect(txEm.assign).toHaveBeenCalledWith(
        testTeamEntity1,
        testUpdateTeamDto1,
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
        testTeamEntity1,
        testUpdateTeamDto1.upToDateDuration,
      );
      expect(txEm.flush).toHaveBeenCalledTimes(1);
    });

    it('should update a team', async () => {
      await expect(
        service.update(testTeamEntity1, testUpdateTeamDto1),
      ).resolves.toEqual(testTeamEntity1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        [testTeamDocParams1, testDocDocParams1, testQnaDocParams1],
      );
    });

    it('should throw a BadRequestException if slug is already taken', async () => {
      jest
        .spyOn(txEm, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush')),
        );
      await expect(
        service.update(testTeamEntity1, testUpdateTeamDto1),
      ).rejects.toThrow(new BadRequestException(teamSlugTakenBadRequest));
    });
  });

  describe('delete', () => {
    it('should delete a team', async () => {
      await expect(service.delete(testTeamEntity1)).resolves.toBeUndefined();
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledWith(testTeamEntity1);
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        [{ id: testTeamEntity1.id }, { query: `team:${testTeamEntity1.id}` }],
      );
    });
  });

  describe('getAffectedPosts', () => {
    const newDurationStr = 'P1Y';

    it('should find all child posts and update their expirations', async () => {
      jest
        .spyOn(em, 'find')
        .mockResolvedValueOnce([testDocEntity1])
        .mockResolvedValueOnce([testQnaEntity1]);
      await expect(
        service.getAffectedPosts(testTeamEntity1, newDurationStr),
      ).resolves.toEqual({ docs: [testDocEntity1], qnas: [testQnaEntity1] });
      expect(em.find).toHaveBeenCalledTimes(2);
      expect(em.find).toHaveBeenCalledWith(DocEntity, {
        team: testTeamEntity1,
        upToDateDuration: null,
      });
      expect(em.find).toHaveBeenCalledWith(QnaEntity, {
        team: testTeamEntity1,
        upToDateDuration: null,
      });
    });
  });
});
