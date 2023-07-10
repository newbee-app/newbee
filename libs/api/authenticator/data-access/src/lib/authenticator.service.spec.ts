import { createMock } from '@golevelup/ts-jest';
import {
  EntityRepository,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthenticatorEntity,
  EntityService,
  testAuthenticatorEntity1,
  testUserChallengeEntity1,
  testUserEntity1,
  UserChallengeEntity,
} from '@newbee/api/shared/data-access';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';
import {
  authenticatorCredentialIdNotFound,
  authenticatorIdNotFound,
  authenticatorTakenBadRequest,
  authenticatorVerifyBadRequest,
  forbiddenError,
  internalServerError,
  testPublicKeyCredentialCreationOptions1,
  testRegistrationResponse1,
} from '@newbee/shared/util';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { AuthenticatorService } from './authenticator.service';

jest.mock('@simplewebauthn/server', () => ({
  __esModule: true,
  generateRegistrationOptions: jest.fn(),
  verifyRegistrationResponse: jest.fn(),
}));
const mockGenerateRegistrationOptions =
  generateRegistrationOptions as jest.Mock;
const mockVerifyRegistrationResponse = verifyRegistrationResponse as jest.Mock;

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  AuthenticatorEntity: jest.fn(),
}));
const mockAuthenticatorEntity = AuthenticatorEntity as jest.Mock;

describe('AuthenticatorService', () => {
  let service: AuthenticatorService;
  let repository: EntityRepository<AuthenticatorEntity>;
  let entityService: EntityService;
  let userChallengeService: UserChallengeService;

  const testCounter = 100;
  const testName = 'MacBook';

  const testRegistrationInfo = {
    credentialID: Buffer.from(
      testAuthenticatorEntity1.credentialId,
      'base64url'
    ),
    credentialPublicKey: Buffer.from(
      testAuthenticatorEntity1.credentialPublicKey,
      'base64url'
    ),
    counter: testAuthenticatorEntity1.counter,
    credentialDeviceType: testAuthenticatorEntity1.credentialDeviceType,
    credentialBackedUp: testAuthenticatorEntity1.credentialBackedUp,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticatorService,
        {
          provide: getRepositoryToken(AuthenticatorEntity),
          useValue: createMock<EntityRepository<AuthenticatorEntity>>({
            create: jest.fn().mockResolvedValue(testAuthenticatorEntity1),
            find: jest.fn().mockResolvedValue([testAuthenticatorEntity1]),
            findOneOrFail: jest
              .fn()
              .mockResolvedValue(testAuthenticatorEntity1),
            getReference: jest.fn().mockReturnValue(testAuthenticatorEntity1),
            assign: jest.fn().mockReturnValue({
              ...testAuthenticatorEntity1,
              counter: testCounter,
            }),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
        },
        {
          provide: UserChallengeService,
          useValue: createMock<UserChallengeService>({
            findOneById: jest.fn().mockResolvedValue(testUserChallengeEntity1),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    service = module.get<AuthenticatorService>(AuthenticatorService);
    repository = module.get<EntityRepository<AuthenticatorEntity>>(
      getRepositoryToken(AuthenticatorEntity)
    );
    entityService = module.get<EntityService>(EntityService);
    userChallengeService =
      module.get<UserChallengeService>(UserChallengeService);

    jest.clearAllMocks();
    mockGenerateRegistrationOptions.mockReturnValue(
      testPublicKeyCredentialCreationOptions1
    );
    mockVerifyRegistrationResponse.mockResolvedValue({
      verified: true,
      registrationInfo: testRegistrationInfo,
    });
    mockAuthenticatorEntity.mockReturnValue(testAuthenticatorEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userChallengeService).toBeDefined();
  });

  describe('generateOptions', () => {
    it('should generate registraiont options', async () => {
      await expect(service.generateOptions(testUserEntity1)).resolves.toEqual(
        testPublicKeyCredentialCreationOptions1
      );
      expect(repository.find).toBeCalledTimes(1);
      expect(repository.find).toBeCalledWith({
        user: { email: testUserEntity1.email },
      });
      expect(mockGenerateRegistrationOptions).toBeCalledTimes(1);
      expect(userChallengeService.updateById).toBeCalledTimes(1);
      expect(userChallengeService.updateById).toBeCalledWith(
        testUserEntity1.id,
        testPublicKeyCredentialCreationOptions1.challenge
      );
    });
  });

  describe('create', () => {
    afterEach(() => {
      expect(userChallengeService.findOneById).toBeCalledTimes(1);
      expect(userChallengeService.findOneById).toBeCalledWith(
        testUserEntity1.id
      );
    });

    it('should create an authenticator', async () => {
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1)
      ).resolves.toEqual(testAuthenticatorEntity1);
      expect(mockVerifyRegistrationResponse).toBeCalledTimes(1);
      expect(mockAuthenticatorEntity).toBeCalledTimes(1);
      expect(mockAuthenticatorEntity).toBeCalledWith(
        testRegistrationInfo.credentialID.toString('base64url'),
        testRegistrationInfo.credentialPublicKey.toString('base64url'),
        testRegistrationInfo.counter,
        testRegistrationInfo.credentialDeviceType,
        testRegistrationInfo.credentialBackedUp,
        null,
        testUserEntity1
      );
      expect(repository.persistAndFlush).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledWith(
        testAuthenticatorEntity1
      );
    });

    it('should throw a BadRequestException if challenge is not defined', async () => {
      jest
        .spyOn(userChallengeService, 'findOneById')
        .mockResolvedValue(new UserChallengeEntity(testUserEntity1, null));
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1)
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
    });

    it('should throw a BadRequestException if challenge cannot be verified', async () => {
      mockVerifyRegistrationResponse.mockResolvedValue({ verified: false });
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1)
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
      expect(mockVerifyRegistrationResponse).toBeCalledTimes(1);
    });

    it('should throw a BadRequestException if challenge is verified without registrationInfo', async () => {
      mockVerifyRegistrationResponse.mockResolvedValue({ verified: true });
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1)
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
    });

    it('should throw a BadRequestException if persistAndFlush throws a UniqueConstraintViolationException', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush'))
        );
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1)
      ).rejects.toThrow(new BadRequestException(authenticatorTakenBadRequest));
      expect(mockVerifyRegistrationResponse).toBeCalledTimes(1);
      expect(mockAuthenticatorEntity).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledTimes(1);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(mockVerifyRegistrationResponse).toBeCalledTimes(1);
      expect(mockAuthenticatorEntity).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledTimes(1);
    });
  });

  describe('findAllByUser', () => {
    afterEach(() => {
      expect(repository.find).toBeCalledTimes(1);
      expect(repository.find).toBeCalledWith({
        user: testUserEntity1,
      });
    });

    it('should get an array of authenticators by user', async () => {
      await expect(service.findAllByUser(testUserEntity1)).resolves.toEqual([
        testAuthenticatorEntity1,
      ]);
    });

    it('should throw an InternalServerErrorException if find throws an error', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('find'));
      await expect(service.findAllByUser(testUserEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });
  });

  describe('findAllByEmail', () => {
    afterEach(() => {
      expect(repository.find).toBeCalledTimes(1);
      expect(repository.find).toBeCalledWith({
        user: { email: testUserEntity1.email },
      });
    });

    it('should get an array of authenticators by user email', async () => {
      await expect(
        service.findAllByEmail(testUserEntity1.email)
      ).resolves.toEqual([testAuthenticatorEntity1]);
    });

    it('should throw an InternalServerErrorException if find throws an error', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('find'));
      await expect(
        service.findAllByEmail(testUserEntity1.email)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith(
        testAuthenticatorEntity1.id
      );
    });

    it('should get a single authenticator by ID', async () => {
      await expect(
        service.findOneById(testAuthenticatorEntity1.id)
      ).resolves.toEqual(testAuthenticatorEntity1);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneById(testAuthenticatorEntity1.id)
      ).rejects.toThrow(new NotFoundException(authenticatorIdNotFound));
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneById(testAuthenticatorEntity1.id)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneByCredentialId', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith({
        credentialId: testAuthenticatorEntity1.credentialId,
      });
    });

    it('should get a single authenticator by credential ID', async () => {
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId)
      ).resolves.toEqual(testAuthenticatorEntity1);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId)
      ).rejects.toThrow(
        new NotFoundException(authenticatorCredentialIdNotFound)
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('updateCounterById', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith(
        testAuthenticatorEntity1.id
      );
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testAuthenticatorEntity1, {
        counter: testCounter,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should update an authenticator by ID', async () => {
      await expect(
        service.updateCounterById(testAuthenticatorEntity1.id, testCounter)
      ).resolves.toEqual({ ...testAuthenticatorEntity1, counter: testCounter });
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.updateCounterById(testAuthenticatorEntity1.id, testCounter)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('updateNameById', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith(
        testAuthenticatorEntity1.id
      );
    });

    it('should update an authenticator by ID', async () => {
      jest
        .spyOn(repository, 'assign')
        .mockReturnValue({ ...testAuthenticatorEntity1, name: testName });
      await expect(
        service.updateNameById(
          testAuthenticatorEntity1.id,
          testName,
          testUserEntity1.id
        )
      ).resolves.toEqual({ ...testAuthenticatorEntity1, name: testName });
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testAuthenticatorEntity1, {
        name: testName,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });

    it(`should throw a ForbiddenException if authenticator's user ID doesn't match the provider user ID`, async () => {
      await expect(
        service.updateNameById(testAuthenticatorEntity1.id, testName, 'badVal')
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.updateCounterById(testAuthenticatorEntity1.id, testCounter)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('deleteOneById', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toBeCalledTimes(1);
      expect(entityService.safeToDelete).toBeCalledWith(
        testAuthenticatorEntity1
      );
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(
        testAuthenticatorEntity1
      );
    });

    it('should delete a single authenticator by ID', async () => {
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id)
      ).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });
});
