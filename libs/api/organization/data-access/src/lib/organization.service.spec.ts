import { createMock } from '@golevelup/ts-jest';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  OrganizationEntity,
  testOrganizationEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseCreateOrganizationDto1,
  testBaseUpdateOrganizationDto1,
} from '@newbee/shared/data-access';
import {
  internalServerError,
  organizationSlugNotFound,
  organizationSlugTakenBadRequest,
} from '@newbee/shared/util';
import { OrganizationService } from './organization.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  OrganizationEntity: jest.fn(),
}));
const mockOrganizationEntity = OrganizationEntity as jest.Mock;

describe('OrganizationService', () => {
  let service: OrganizationService;
  let repository: EntityRepository<OrganizationEntity>;

  const testUpdatedOrganization = {
    ...testOrganizationEntity1,
    ...testBaseUpdateOrganizationDto1,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: getRepositoryToken(OrganizationEntity),
          useValue: createMock<EntityRepository<OrganizationEntity>>({
            findOne: jest.fn().mockResolvedValue(testOrganizationEntity1),
            findOneOrFail: jest.fn().mockResolvedValue(testOrganizationEntity1),
            assign: jest.fn().mockReturnValue(testUpdatedOrganization),
          }),
        },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
    repository = module.get<EntityRepository<OrganizationEntity>>(
      getRepositoryToken(OrganizationEntity)
    );

    jest.clearAllMocks();
    mockOrganizationEntity.mockReturnValue(testOrganizationEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockOrganizationEntity).toBeCalledTimes(1);
      expect(mockOrganizationEntity).toBeCalledWith(
        testBaseCreateOrganizationDto1.name,
        testBaseCreateOrganizationDto1.slug,
        testUserEntity1
      );
      expect(repository.persistAndFlush).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledWith(
        testOrganizationEntity1
      );
    });

    it('should create an organization', async () => {
      await expect(
        service.create(testBaseCreateOrganizationDto1, testUserEntity1)
      ).resolves.toEqual(testOrganizationEntity1);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testBaseCreateOrganizationDto1, testUserEntity1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if name already exists', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush'))
        );
      await expect(
        service.create(testBaseCreateOrganizationDto1, testUserEntity1)
      ).rejects.toThrow(
        new BadRequestException(organizationSlugTakenBadRequest)
      );
    });
  });

  describe('hasOneBySlug', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        slug: testOrganizationEntity1.slug,
      });
    });

    it(`should say an organization exists if it's found`, async () => {
      await expect(
        service.hasOneBySlug(testOrganizationEntity1.slug)
      ).resolves.toBeTruthy();
    });

    it(`should say an organization does not exist if it can't be found`, async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(
        service.hasOneBySlug(testOrganizationEntity1.slug)
      ).resolves.toBeFalsy();
    });
  });

  describe('findOneBySlug', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith({
        slug: testOrganizationEntity1.slug,
      });
    });

    it('should find an organization', async () => {
      await expect(
        service.findOneBySlug(testOrganizationEntity1.slug)
      ).resolves.toEqual(testOrganizationEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneBySlug(testOrganizationEntity1.slug)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if slug does not exist', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneBySlug(testOrganizationEntity1.slug)
      ).rejects.toThrow(new NotFoundException(organizationSlugNotFound));
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should update an organization', async () => {
      await expect(
        service.update(testOrganizationEntity1, testBaseUpdateOrganizationDto1)
      ).resolves.toEqual(testUpdatedOrganization);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testOrganizationEntity1, testBaseUpdateOrganizationDto1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if name already exists', async () => {
      jest
        .spyOn(repository, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush'))
        );
      await expect(
        service.update(testOrganizationEntity1, testBaseUpdateOrganizationDto1)
      ).rejects.toThrow(
        new BadRequestException(organizationSlugTakenBadRequest)
      );
    });
  });

  describe('update', () => {
    it('should remove an organization', async () => {
      await expect(
        service.delete(testOrganizationEntity1)
      ).resolves.toBeUndefined();
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testOrganizationEntity1);
    });
  });
});
