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
import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthenticatorEntity,
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
  internalServerError,
  testPublicKeyCredentialCreationOptions1,
  testRegistrationCredential1,
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

describe('AuthenticatorService', () => {
  let service: AuthenticatorService;
  let repository: EntityRepository<AuthenticatorEntity>;
  let userChallengeService: UserChallengeService;

  const testCounter = 100;

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
            find: jest.fn().mockResolvedValue([testAuthenticatorEntity1]),
            findOneOrFail: jest
              .fn()
              .mockResolvedValue(testAuthenticatorEntity1),
            getReference: jest.fn().mockReturnValue(testAuthenticatorEntity1),
            create: jest.fn().mockReturnValue(testAuthenticatorEntity1),
            assign: jest.fn().mockReturnValue({
              ...testAuthenticatorEntity1,
              counter: testCounter,
            }),
          }),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(userChallengeService).toBeDefined();
  });

  describe('generateChallenge', () => {
    it('should generate a challenge', async () => {
      await expect(service.generateChallenge(testUserEntity1)).resolves.toEqual(
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
        service.create(testRegistrationCredential1, testUserEntity1)
      ).resolves.toEqual(testAuthenticatorEntity1);
      expect(mockVerifyRegistrationResponse).toBeCalledTimes(1);
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.create).toBeCalledWith({
        credentialId: testRegistrationInfo.credentialID.toString('base64url'),
        credentialPublicKey:
          testRegistrationInfo.credentialPublicKey.toString('base64url'),
        counter: testRegistrationInfo.counter,
        credentialDeviceType: testRegistrationInfo.credentialDeviceType,
        credentialBackedUp: testRegistrationInfo.credentialBackedUp,
        ...(testRegistrationCredential1.transports && {
          transports: testRegistrationCredential1.transports,
        }),
        user: testUserEntity1,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should throw a BadRequestException if challenge is not defined', async () => {
      jest
        .spyOn(userChallengeService, 'findOneById')
        .mockResolvedValue(new UserChallengeEntity({ user: testUserEntity1 }));
      await expect(
        service.create(testRegistrationCredential1, testUserEntity1)
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
    });

    it('should throw a BadRequestException if challenge cannot be verified', async () => {
      mockVerifyRegistrationResponse.mockResolvedValue({ verified: false });
      await expect(
        service.create(testRegistrationCredential1, testUserEntity1)
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
      expect(mockVerifyRegistrationResponse).toBeCalledTimes(1);
    });

    it('should throw a BadRequestException if challenge is verified without registrationInfo', async () => {
      mockVerifyRegistrationResponse.mockResolvedValue({ verified: true });
      await expect(
        service.create(testRegistrationCredential1, testUserEntity1)
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
    });

    it('should throw a BadRequestException if flush throws a UniqueConstraintViolationException', async () => {
      jest
        .spyOn(repository, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush'))
        );
      await expect(
        service.create(testRegistrationCredential1, testUserEntity1)
      ).rejects.toThrow(new BadRequestException(authenticatorTakenBadRequest));
      expect(mockVerifyRegistrationResponse).toBeCalledTimes(1);
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.create(testRegistrationCredential1, testUserEntity1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(mockVerifyRegistrationResponse).toBeCalledTimes(1);
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.flush).toBeCalledTimes(1);
    });
  });

  describe('findAllByEmail', () => {
    it('should get an array of authenticators by user ID', async () => {
      await expect(
        service.findAllByEmail(testUserEntity1.email)
      ).resolves.toEqual([testAuthenticatorEntity1]);
      expect(repository.find).toBeCalledTimes(1);
      expect(repository.find).toBeCalledWith({
        user: { email: testUserEntity1.email },
      });
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

  describe('updateById', () => {
    it('should update an authenticator by ID', async () => {
      await expect(
        service.updateById(testAuthenticatorEntity1.id, testCounter)
      ).resolves.toEqual({ ...testAuthenticatorEntity1, counter: testCounter });
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
  });

  describe('deleteOneById', () => {
    it('should delete a single authenticator by ID', async () => {
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id)
      ).resolves.toBeUndefined();
      expect(repository.getReference).toBeCalledTimes(1);
      expect(repository.getReference).toBeCalledWith(
        testAuthenticatorEntity1.id
      );
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(
        testAuthenticatorEntity1
      );
    });
  });
});
