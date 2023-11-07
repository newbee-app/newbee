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
  testOrganizationEntity1,
  testQnaDocParams1,
  testQnaEntity1,
  testTeamEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { newOrgConfigset } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  testBaseCreateOrganizationDto1,
  testBaseUpdateOrganizationDto1,
} from '@newbee/shared/data-access';
import {
  internalServerError,
  nbDayjs,
  organizationSlugNotFound,
  organizationSlugTakenBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
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
  let entityService: EntityService;
  let teamService: TeamService;
  let solrCli: SolrCli;

  const testOrganizationEntity = createMock<OrganizationEntity>({
    ...testOrganizationEntity1,
    members: createMock<Collection<OrgMemberEntity>>(),
  });
  const testUpdatedOrganization = {
    ...testOrganizationEntity,
    ...testBaseUpdateOrganizationDto1,
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
          provide: EntityService,
          useValue: createMock<EntityService>({
            createDocDocParams: jest.fn().mockReturnValue(testDocDocParams1),
            createQnaDocParams: jest.fn().mockReturnValue(testQnaDocParams1),
          }),
        },
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            changeUpToDateDuration: jest.fn().mockResolvedValue({
              docs: [testDocEntity1],
              qnas: testQnaEntity1,
            }),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);
    teamService = module.get<TeamService>(TeamService);
    solrCli = module.get<SolrCli>(SolrCli);

    jest.clearAllMocks();
    mockOrganizationEntity.mockReturnValue(testOrganizationEntity);
    mockV4.mockReturnValue(testOrganizationEntity.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
    expect(teamService).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockOrganizationEntity).toBeCalledTimes(1);
      expect(mockOrganizationEntity).toBeCalledWith(
        testOrganizationEntity.id,
        testBaseCreateOrganizationDto1.name,
        testBaseCreateOrganizationDto1.slug,
        testBaseCreateOrganizationDto1.upToDateDuration,
        testUserEntity1,
      );
      expect(em.persistAndFlush).toBeCalledTimes(1);
      expect(em.persistAndFlush).toBeCalledWith(testOrganizationEntity);
    });

    it('should create an organization', async () => {
      await expect(
        service.create(testBaseCreateOrganizationDto1, testUserEntity1),
      ).resolves.toEqual(testOrganizationEntity);
      expect(solrCli.createCollection).toBeCalledTimes(1);
      expect(solrCli.createCollection).toBeCalledWith({
        name: testOrganizationEntity.id,
        numShards: 1,
        config: newOrgConfigset,
      });
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testBaseCreateOrganizationDto1, testUserEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if name already exists', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(
        service.create(testBaseCreateOrganizationDto1, testUserEntity1),
      ).rejects.toThrow(
        new BadRequestException(organizationSlugTakenBadRequest),
      );
    });

    it('should throw an InternalServerErrorException and delete if createCollection throws an error', async () => {
      jest
        .spyOn(solrCli, 'createCollection')
        .mockRejectedValue(new Error('createCollection'));
      await expect(
        service.create(testBaseCreateOrganizationDto1, testUserEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(solrCli.createCollection).toBeCalledTimes(1);
      expect(em.removeAndFlush).toBeCalledTimes(1);
      expect(em.removeAndFlush).toBeCalledWith(testOrganizationEntity);
    });
  });

  describe('hasOneBySlug', () => {
    afterEach(() => {
      expect(em.findOne).toBeCalledTimes(1);
      expect(em.findOne).toBeCalledWith(OrganizationEntity, {
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
    afterEach(() => {
      expect(em.findOneOrFail).toBeCalledTimes(1);
      expect(em.findOneOrFail).toBeCalledWith(OrganizationEntity, {
        slug: testOrganizationEntity.slug,
      });
    });

    it('should find an organization', async () => {
      await expect(
        service.findOneBySlug(testOrganizationEntity.slug),
      ).resolves.toEqual(testOrganizationEntity);
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
      expect(em.assign).toBeCalledTimes(1);
      expect(em.assign).toBeCalledWith(
        testOrganizationEntity,
        testBaseUpdateOrganizationDto1,
      );
      expect(service.changeUpToDateDuration).toBeCalledTimes(1);
      expect(service.changeUpToDateDuration).toBeCalledWith(
        testOrganizationEntity,
        testBaseUpdateOrganizationDto1.upToDateDuration,
      );
      expect(em.flush).toBeCalledTimes(1);
    });

    it('should update an organization', async () => {
      await expect(
        service.update(testOrganizationEntity, testBaseUpdateOrganizationDto1),
      ).resolves.toEqual(testUpdatedOrganization);

      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity.id,
        [testDocDocParams1, testQnaDocParams1],
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testOrganizationEntity, testBaseUpdateOrganizationDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if name already exists', async () => {
      jest
        .spyOn(em, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush')),
        );
      await expect(
        service.update(testOrganizationEntity, testBaseUpdateOrganizationDto1),
      ).rejects.toThrow(
        new BadRequestException(organizationSlugTakenBadRequest),
      );
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(
        service.update(testOrganizationEntity, testBaseUpdateOrganizationDto1),
      ).resolves.toEqual(testUpdatedOrganization);

      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity.id,
        [testDocDocParams1, testQnaDocParams1],
      );
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toBeCalledTimes(1);
      expect(entityService.safeToDelete).toBeCalledWith(testOrganizationEntity);
      expect(em.removeAndFlush).toBeCalledTimes(1);
      expect(em.removeAndFlush).toBeCalledWith(testOrganizationEntity);
    });

    it('should remove an organization', async () => {
      await expect(
        service.delete(testOrganizationEntity),
      ).resolves.toBeUndefined();
      expect(solrCli.deleteCollection).toBeCalledTimes(1);
      expect(solrCli.deleteCollection).toBeCalledWith(
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
      expect(solrCli.deleteCollection).toBeCalledTimes(1);
    });
  });

  describe('changeUpToDateDuration', () => {
    const newDurationStr = 'P1Y';
    const newDuration = nbDayjs.duration(newDurationStr);

    beforeEach(() => {
      jest
        .spyOn(em, 'find')
        .mockResolvedValueOnce([testTeamEntity1])
        .mockResolvedValueOnce([testDocEntity1])
        .mockResolvedValueOnce([testQnaEntity1]);
    });

    afterEach(() => {
      expect(em.find).toBeCalledWith(TeamEntity, {
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

      expect(em.find).toBeCalledTimes(3);
      expect(em.find).toBeCalledWith(DocEntity, {
        organization: testOrganizationEntity,
        team: null,
        upToDateDuration: null,
      });
      expect(em.find).toBeCalledWith(QnaEntity, {
        organization: testOrganizationEntity,
        team: null,
        upToDateDuration: null,
      });

      expect(teamService.changeUpToDateDuration).toBeCalledTimes(1);
      expect(teamService.changeUpToDateDuration).toBeCalledWith(
        testTeamEntity1,
        newDurationStr,
      );

      expect(em.assign).toBeCalledTimes(2);
      expect(em.assign).toBeCalledWith(testDocEntity1, {
        outOfDateAt: nbDayjs(testDocEntity1.markedUpToDateAt)
          .add(newDuration)
          .toDate(),
      });
      expect(em.assign).toBeCalledWith(testQnaEntity1, {
        outOfDateAt: nbDayjs(testQnaEntity1.markedUpToDateAt)
          .add(newDuration)
          .toDate(),
      });
    });

    it('should throw an InternalServerErrorException if find throws an error', async () => {
      jest.spyOn(em, 'find').mockReset().mockRejectedValue(new Error('find'));
      await expect(
        service.changeUpToDateDuration(testOrganizationEntity, newDurationStr),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.find).toBeCalledTimes(1);
    });
  });
});
