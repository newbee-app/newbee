import { createMock } from '@golevelup/ts-jest';
import {
  Collection,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  EntityService,
  OrgMemberEntity,
  UserEntity,
  testUserEntity1,
  testUserInvitesEntity1,
} from '@newbee/api/shared/data-access';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import {
  internalServerError,
  testBaseCreateUserDto1,
  testBaseUpdateUserDto1,
  testPublicKeyCredentialCreationOptions1,
  userEmailNotFound,
  userEmailTakenBadRequest,
  userIdNotFound,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { v4 } from 'uuid';
import type { UserAndOptions } from './interface';
import { UserService } from './user.service';

jest.mock('@simplewebauthn/server', () => ({
  __esModule: true,
  generateRegistrationOptions: jest.fn(),
}));
const mockGenerateRegistrationOptions =
  generateRegistrationOptions as jest.Mock;

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  UserEntity: jest.fn(),
}));
const mockUserEntity = UserEntity as jest.Mock;

describe('UserService', () => {
  let service: UserService;
  let em: EntityManager;
  let entityService: EntityService;
  let userInvitesService: UserInvitesService;

  const testUserEntity = createMock<UserEntity>({
    ...testUserEntity1,
    organizations: createMock<Collection<OrgMemberEntity>>(),
  });
  const testUpdatedUser = { ...testUserEntity, ...testBaseUpdateUserDto1 };
  const testUserAndOptions: UserAndOptions = {
    user: testUserEntity,
    options: testPublicKeyCredentialCreationOptions1,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: EntityManager,
          useValue: createMock<EntityRepository<UserEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testUserEntity),
            findOne: jest.fn().mockResolvedValue(testUserEntity),
            assign: jest.fn().mockReturnValue(testUpdatedUser),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
        },
        {
          provide: UserInvitesService,
          useValue: createMock<UserInvitesService>({
            findOrCreateOneByEmail: jest
              .fn()
              .mockResolvedValue(testUserInvitesEntity1),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);
    userInvitesService = module.get<UserInvitesService>(UserInvitesService);

    jest.clearAllMocks();
    mockGenerateRegistrationOptions.mockReturnValue(testUserAndOptions.options);
    mockV4.mockReturnValue(testUserEntity.id);
    mockUserEntity.mockReturnValue(testUserEntity);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userInvitesService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(userInvitesService.findOrCreateOneByEmail).toBeCalledTimes(1);
      expect(userInvitesService.findOrCreateOneByEmail).toBeCalledWith(
        testBaseCreateUserDto1.email,
      );
      expect(mockGenerateRegistrationOptions).toBeCalledTimes(1);
      expect(em.persistAndFlush).toBeCalledTimes(1);
      expect(em.persistAndFlush).toBeCalledWith(testUserEntity);
    });

    it('should create a user', async () => {
      await expect(service.create(testBaseCreateUserDto1)).resolves.toEqual(
        testUserAndOptions,
      );
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(service.create(testBaseCreateUserDto1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should throw a BadRequestException if email already exists', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(service.create(testBaseCreateUserDto1)).rejects.toThrow(
        new BadRequestException(userEmailTakenBadRequest),
      );
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toBeCalledTimes(1);
      expect(em.findOneOrFail).toBeCalledWith(UserEntity, testUserEntity.id);
    });

    it('should get a single user by id', async () => {
      await expect(service.findOneById(testUserEntity.id)).resolves.toEqual(
        testUserEntity,
      );
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(service.findOneById(testUserEntity.id)).rejects.toThrow(
        new NotFoundException(userIdNotFound),
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(service.findOneById(testUserEntity.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('findOneByEmail', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toBeCalledTimes(1);
      expect(em.findOneOrFail).toBeCalledWith(UserEntity, {
        email: testUserEntity.email,
      });
    });

    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmail(testUserEntity.email),
      ).resolves.toEqual(testUserEntity);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity.email),
      ).rejects.toThrow(new NotFoundException(userEmailNotFound));
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneByEmailOrNull', () => {
    afterEach(() => {
      expect(em.findOne).toBeCalledTimes(1);
      expect(em.findOne).toBeCalledWith(UserEntity, {
        email: testUserEntity.email,
      });
    });

    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmailOrNull(testUserEntity.email),
      ).resolves.toEqual(testUserEntity);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneByEmailOrNull(testUserEntity.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(em.assign).toBeCalledTimes(1);
      expect(em.assign).toBeCalledWith(testUserEntity, testBaseUpdateUserDto1);
      expect(em.flush).toBeCalledTimes(1);
    });

    it('should update the user', async () => {
      await expect(
        service.update(testUserEntity, testBaseUpdateUserDto1),
      ).resolves.toEqual(testUpdatedUser);
    });

    it('should throw a BadRequestException if email already exists', async () => {
      jest
        .spyOn(em, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush')),
        );
      await expect(
        service.update(testUserEntity, testBaseUpdateUserDto1),
      ).rejects.toThrow(new BadRequestException(userEmailTakenBadRequest));
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testUserEntity, testBaseUpdateUserDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toBeCalledTimes(1);
      expect(entityService.safeToDelete).toBeCalledWith(testUserEntity);
      expect(em.removeAndFlush).toBeCalledTimes(1);
      expect(em.removeAndFlush).toBeCalledWith(testUserEntity);
    });

    it('should delete the user', async () => {
      await expect(service.delete(testUserEntity)).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testUserEntity)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });
});
