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
  organizationNameNotFound,
  organizationNameTakenBadRequest,
} from '@newbee/shared/util';
import { v4 } from 'uuid';
import { OrganizationService } from './organization.service';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

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
    mockV4.mockReturnValue(testOrganizationEntity1.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
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
        new BadRequestException(organizationNameTakenBadRequest)
      );
    });
  });

  describe('findOneByName', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith({
        name: testOrganizationEntity1.name,
      });
    });

    it('should find an organization', async () => {
      await expect(
        service.findOneByName(testOrganizationEntity1.name)
      ).resolves.toEqual(testOrganizationEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByName(testOrganizationEntity1.name)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if name does not exist', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByName(testOrganizationEntity1.name)
      ).rejects.toThrow(new NotFoundException(organizationNameNotFound));
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
        new BadRequestException(organizationNameTakenBadRequest)
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
