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
import { Test, TestingModule } from '@nestjs/testing';
import {
  testOrganizationEntity1,
  testUserEntity1,
  testUserOrganizationEntity1,
  UserOrganizationEntity,
} from '@newbee/api/shared/data-access';
import {
  internalServerError,
  userAlreadyInOrganizationBadRequest,
  userOrganizationNotFound,
} from '@newbee/shared/util';
import { UserOrganizationService } from './user-organization.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  UserOrganizationEntity: jest.fn(),
}));
const mockUserOrganizationEntity = UserOrganizationEntity as jest.Mock;

describe('UserOrganizationService', () => {
  let service: UserOrganizationService;
  let repository: EntityRepository<UserOrganizationEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserOrganizationService,
        {
          provide: getRepositoryToken(UserOrganizationEntity),
          useValue: createMock<EntityRepository<UserOrganizationEntity>>({
            findOneOrFail: jest
              .fn()
              .mockResolvedValue(testUserOrganizationEntity1),
          }),
        },
      ],
    }).compile();

    service = module.get<UserOrganizationService>(UserOrganizationService);
    repository = module.get<EntityRepository<UserOrganizationEntity>>(
      getRepositoryToken(UserOrganizationEntity)
    );

    jest.clearAllMocks();
    mockUserOrganizationEntity.mockReturnValue(testUserOrganizationEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockUserOrganizationEntity).toBeCalledTimes(1);
      expect(mockUserOrganizationEntity).toBeCalledWith(
        testUserEntity1,
        testOrganizationEntity1
      );
      expect(repository.persistAndFlush).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledWith(
        testUserOrganizationEntity1
      );
    });

    it('should create a new user organization', async () => {
      await expect(
        service.create(testUserEntity1, testOrganizationEntity1)
      ).resolves.toEqual(testUserOrganizationEntity1);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testUserEntity1, testOrganizationEntity1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if user is already in the organization', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush'))
        );
      await expect(
        service.create(testUserEntity1, testOrganizationEntity1)
      ).rejects.toThrow(
        new BadRequestException(userAlreadyInOrganizationBadRequest)
      );
    });
  });

  describe('findOneByUserAndOrganization', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith({
        user: testUserEntity1,
        organization: testOrganizationEntity1,
      });
    });

    it('should find a user organization', async () => {
      await expect(
        service.findOneByUserAndOrganization(
          testUserEntity1,
          testOrganizationEntity1
        )
      ).resolves.toEqual(testUserOrganizationEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByUserAndOrganization(
          testUserEntity1,
          testOrganizationEntity1
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if user does not exist in the organization', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByUserAndOrganization(
          testUserEntity1,
          testOrganizationEntity1
        )
      ).rejects.toThrow(new NotFoundException(userOrganizationNotFound));
    });
  });
});
