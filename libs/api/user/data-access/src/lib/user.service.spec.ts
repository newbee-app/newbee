import { createMock } from '@golevelup/ts-jest';
import {
  EntityRepository,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  testUserAndOptionsDto1,
  testUserEntity1,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  testBaseCreateUserDto1,
  testBaseUpdateUserDto1,
} from '@newbee/shared/data-access';
import {
  internalServerError,
  userEmailNotFound,
  userEmailTakenBadRequest,
  userIdNotFound,
} from '@newbee/shared/util';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { UserService } from './user.service';

jest.mock('@simplewebauthn/server', () => ({
  __esModule: true,
  generateRegistrationOptions: jest.fn(),
}));
const mockGenerateRegistrationOptions =
  generateRegistrationOptions as jest.Mock;

describe('UserService', () => {
  let service: UserService;
  let repository: EntityRepository<UserEntity>;
  const testUpdatedUser = { ...testUserEntity1, ...testBaseUpdateUserDto1 };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMock<EntityRepository<UserEntity>>({
            create: jest.fn().mockReturnValue(testUserEntity1),
            findOneOrFail: jest.fn().mockResolvedValue(testUserEntity1),
            assign: jest.fn().mockReturnValue(testUpdatedUser),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<EntityRepository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );

    jest.clearAllMocks();
    mockGenerateRegistrationOptions.mockReturnValue(
      testUserAndOptionsDto1.options
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockGenerateRegistrationOptions).toBeCalledTimes(1);
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should create a user', async () => {
      await expect(service.create(testBaseCreateUserDto1)).resolves.toEqual(
        testUserAndOptionsDto1
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(service.create(testBaseCreateUserDto1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });

    it('should throw a BadRequestException if email already exists', async () => {
      jest
        .spyOn(repository, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush'))
        );
      await expect(service.create(testBaseCreateUserDto1)).rejects.toThrow(
        new BadRequestException(userEmailTakenBadRequest)
      );
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith(testUserEntity1.id);
    });

    it('should get a single user by id', async () => {
      await expect(service.findOneById(testUserEntity1.id)).resolves.toEqual(
        testUserEntity1
      );
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(service.findOneById(testUserEntity1.id)).rejects.toThrow(
        new NotFoundException(userIdNotFound)
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(service.findOneById(testUserEntity1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });
  });

  describe('findOneByEmail', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith({
        email: testUserEntity1.email,
      });
    });

    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmail(testUserEntity1.email)
      ).resolves.toEqual(testUserEntity1);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity1.email)
      ).rejects.toThrow(new NotFoundException(userEmailNotFound));
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity1.email)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(
        testUserEntity1,
        testBaseUpdateUserDto1
      );
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should update the user', async () => {
      await expect(
        service.update(testUserEntity1, testBaseUpdateUserDto1)
      ).resolves.toEqual(testUpdatedUser);
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testUserEntity1);
    });

    it('should delete the user', async () => {
      await expect(service.delete(testUserEntity1)).resolves.toBeUndefined();
    });
  });
});
