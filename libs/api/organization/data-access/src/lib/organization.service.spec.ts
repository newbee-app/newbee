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
  EntityService,
  OrgMemberEntity,
  OrganizationEntity,
  testOrganizationEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { newOrgConfigset } from '@newbee/api/shared/util';
import {
  testBaseCreateOrganizationDto1,
  testBaseUpdateOrganizationDto1,
} from '@newbee/shared/data-access';
import {
  internalServerError,
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
          useValue: createMock<EntityService>(),
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
    solrCli = module.get<SolrCli>(SolrCli);

    jest.clearAllMocks();
    mockOrganizationEntity.mockReturnValue(testOrganizationEntity);
    mockV4.mockReturnValue(testOrganizationEntity.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockOrganizationEntity).toBeCalledTimes(1);
      expect(mockOrganizationEntity).toBeCalledWith(
        testOrganizationEntity.id,
        testBaseCreateOrganizationDto1.name,
        testBaseCreateOrganizationDto1.slug,
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
    afterEach(() => {
      expect(em.flush).toBeCalledTimes(1);
    });

    it('should update an organization', async () => {
      await expect(
        service.update(testOrganizationEntity, testBaseUpdateOrganizationDto1),
      ).resolves.toEqual(testUpdatedOrganization);
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
});
