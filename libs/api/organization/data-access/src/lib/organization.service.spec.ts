import { createMock } from '@golevelup/ts-jest';
import {
  Collection,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  DocEntity,
  EntityService,
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
  internalServerError,
  organizationSlugNotFound,
  organizationSlugTakenBadRequest,
  testCreateOrganizationDto1,
  testNow1,
  testUpdateOrganizationDto1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { OrganizationService } from './organization.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  OrganizationEntity: jest.fn(),
}));
const mockOrganizationEntity = OrganizationEntity as jest.Mock;

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('OrganizationService', () => {
  let service: OrganizationService;
  let em: EntityManager;
  let solrCli: SolrCli;
  let entityService: EntityService;
  let teamService: TeamService;

  const testOrganizationEntity = createMock<OrganizationEntity>({
    ...testOrganizationEntity1,
    members: createMock<Collection<OrgMemberEntity>>({
      getItems: jest.fn().mockReturnValue([testOrgMemberEntity1]),
    }),
  });
  const testUpdatedOrganization = {
    ...testOrganizationEntity,
    ...testUpdateOrganizationDto1,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testOrganizationEntity),
            findOneOrFail: jest.fn().mockResolvedValue(testOrganizationEntity),
            assign: jest.fn().mockReturnValue(testUpdatedOrganization),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
        },
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            changeUpToDateDuration: jest.fn().mockResolvedValue({
              docs: [testDocEntity1],
              qnas: [testQnaEntity1],
            }),
          }),
        },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
    em = module.get<EntityManager>(EntityManager);
    solrCli = module.get<SolrCli>(SolrCli);
    entityService = module.get<EntityService>(EntityService);
    teamService = module.get<TeamService>(TeamService);

    jest.clearAllMocks();
    mockOrganizationEntity.mockReturnValue(testOrganizationEntity);
    mockV4.mockReturnValue(testOrganizationEntity.id);

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(entityService).toBeDefined();
    expect(teamService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockOrganizationEntity).toHaveBeenCalledTimes(1);
      expect(mockOrganizationEntity).toHaveBeenCalledWith(
        testOrganizationEntity.id,
        testCreateOrganizationDto1.name,
        testCreateOrganizationDto1.slug,
        testCreateOrganizationDto1.upToDateDuration,
        testUserEntity1,
      );
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testOrganizationEntity);
    });

    it('should create an organization', async () => {
      await expect(
        service.create(testCreateOrganizationDto1, testUserEntity1),
      ).resolves.toEqual(testOrganizationEntity);
      expect(solrCli.createCollection).toHaveBeenCalledTimes(1);
      expect(solrCli.createCollection).toHaveBeenCalledWith({
        name: testOrganizationEntity.id,
        numShards: 1,
        config: solrOrgConfigset,
      });
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(testOrganizationEntity.id, [
        testOrgMemberDocParams1,
      ]);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testCreateOrganizationDto1, testUserEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if name already exists', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(
        service.create(testCreateOrganizationDto1, testUserEntity1),
      ).rejects.toThrow(
        new BadRequestException(organizationSlugTakenBadRequest),
      );
    });

    it('should throw an InternalServerErrorException and delete if createCollection throws an error', async () => {
      jest
        .spyOn(solrCli, 'createCollection')
        .mockRejectedValue(new Error('createCollection'));
      await expect(
        service.create(testCreateOrganizationDto1, testUserEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(solrCli.createCollection).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testOrganizationEntity);
    });
  });

  describe('hasOneBySlug', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(OrganizationEntity, {
        slug: testOrganizationEntity.slug,
      });
    });

    it(`should say an organization exists if it's found`, async () => {
      await expect(
        service.hasOneBySlug(testOrganizationEntity.slug),
      ).resolves.toBeTruthy();
    });

    it(`should say an organization does not exist if it can't be found`, async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.hasOneBySlug(testOrganizationEntity.slug),
      ).resolves.toBeFalsy();
    });
  });

  describe('findOneBySlug', () => {
    beforeEach(() => {
      jest.spyOn(service, 'buildSuggesters');
    });

    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(OrganizationEntity, {
        slug: testOrganizationEntity.slug,
      });
    });

    it('should find an organization', async () => {
      await expect(
        service.findOneBySlug(testOrganizationEntity.slug),
      ).resolves.toEqual(testOrganizationEntity);
      expect(service.buildSuggesters).not.toHaveBeenCalled();
    });

    it(`should build the suggester if it's been at least a day since last build`, async () => {
      const testOrganizationEntity2: OrganizationEntity = {
        ...testOrganizationEntity,
        suggesterBuiltAt: dayjs().subtract(1, 'day').toDate(),
      };
      jest
        .spyOn(em, 'findOneOrFail')
        .mockResolvedValue(testOrganizationEntity2);
      jest.spyOn(em, 'assign').mockReturnValue(testOrganizationEntity);

      await expect(
        service.findOneBySlug(testOrganizationEntity.slug),
      ).resolves.toEqual(testOrganizationEntity);
      expect(service.buildSuggesters).toHaveBeenCalledTimes(1);
      expect(service.buildSuggesters).toHaveBeenCalledWith(
        testOrganizationEntity,
      );
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testOrganizationEntity, {
        suggesterBuiltAt: testNow1,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneBySlug(testOrganizationEntity.slug),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if slug does not exist', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneBySlug(testOrganizationEntity.slug),
      ).rejects.toThrow(new NotFoundException(organizationSlugNotFound));
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest
        .spyOn(service, 'changeUpToDateDuration')
        .mockResolvedValue({ docs: [testDocEntity1], qnas: [testQnaEntity1] });
    });

    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(
        testOrganizationEntity,
        testUpdateOrganizationDto1,
      );
      expect(service.changeUpToDateDuration).toHaveBeenCalledTimes(1);
      expect(service.changeUpToDateDuration).toHaveBeenCalledWith(
        testOrganizationEntity,
        testUpdateOrganizationDto1.upToDateDuration,
      );
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should update an organization', async () => {
      await expect(
        service.update(testOrganizationEntity, testUpdateOrganizationDto1),
      ).resolves.toEqual(testUpdatedOrganization);

      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity.id,
        [testDocDocParams1, testQnaDocParams1],
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testOrganizationEntity, testUpdateOrganizationDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if name already exists', async () => {
      jest
        .spyOn(em, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush')),
        );
      await expect(
        service.update(testOrganizationEntity, testUpdateOrganizationDto1),
      ).rejects.toThrow(
        new BadRequestException(organizationSlugTakenBadRequest),
      );
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(
        service.update(testOrganizationEntity, testUpdateOrganizationDto1),
      ).resolves.toEqual(testUpdatedOrganization);

      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity.id,
        [testDocDocParams1, testQnaDocParams1],
      );
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(
        testOrganizationEntity,
      );
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testOrganizationEntity);
    });

    it('should remove an organization', async () => {
      await expect(
        service.delete(testOrganizationEntity),
      ).resolves.toBeUndefined();
      expect(solrCli.deleteCollection).toHaveBeenCalledTimes(1);
      expect(solrCli.deleteCollection).toHaveBeenCalledWith(
        testOrganizationEntity.id,
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testOrganizationEntity)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should not throw if deleteCollection throws an error', async () => {
      jest
        .spyOn(solrCli, 'deleteCollection')
        .mockRejectedValue(new Error('deleteCollection'));
      await expect(
        service.delete(testOrganizationEntity),
      ).resolves.toBeUndefined();
      expect(solrCli.deleteCollection).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeUpToDateDuration', () => {
    const newDurationStr = 'P1Y';
    const newDuration = dayjs.duration(newDurationStr);

    beforeEach(() => {
      jest
        .spyOn(em, 'find')
        .mockResolvedValueOnce([testTeamEntity1])
        .mockResolvedValueOnce([testDocEntity1])
        .mockResolvedValueOnce([testQnaEntity1]);
    });

    afterEach(() => {
      expect(em.find).toHaveBeenCalledWith(TeamEntity, {
        organization: testOrganizationEntity,
        upToDateDuration: null,
      });
    });

    it('should find all child posts and upate their expirations', async () => {
      await expect(
        service.changeUpToDateDuration(testOrganizationEntity, newDurationStr),
      ).resolves.toEqual({
        docs: [testDocEntity1, testDocEntity1],
        qnas: [testQnaEntity1, testQnaEntity1],
      });

      expect(em.find).toHaveBeenCalledTimes(3);
      expect(em.find).toHaveBeenCalledWith(DocEntity, {
        organization: testOrganizationEntity,
        team: null,
        upToDateDuration: null,
      });
      expect(em.find).toHaveBeenCalledWith(QnaEntity, {
        organization: testOrganizationEntity,
        team: null,
        upToDateDuration: null,
      });

      expect(teamService.changeUpToDateDuration).toHaveBeenCalledTimes(1);
      expect(teamService.changeUpToDateDuration).toHaveBeenCalledWith(
        testTeamEntity1,
        newDurationStr,
      );

      expect(em.assign).toHaveBeenCalledTimes(2);
      expect(em.assign).toHaveBeenCalledWith(testDocEntity1, {
        outOfDateAt: dayjs(testDocEntity1.markedUpToDateAt)
          .add(newDuration)
          .toDate(),
      });
      expect(em.assign).toHaveBeenCalledWith(testQnaEntity1, {
        outOfDateAt: dayjs(testQnaEntity1.markedUpToDateAt)
          .add(newDuration)
          .toDate(),
      });
    });

    it('should throw an InternalServerErrorException if find throws an error', async () => {
      jest.spyOn(em, 'find').mockReset().mockRejectedValue(new Error('find'));
      await expect(
        service.changeUpToDateDuration(testOrganizationEntity, newDurationStr),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.find).toHaveBeenCalledTimes(1);
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
