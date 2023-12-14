import { createMock } from '@golevelup/ts-jest';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
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
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
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
  let em: EntityManager;
  let entityService: EntityService;
  let userService: UserService;

  const testCounter = 100;
  const testName = 'MacBook';

  const testRegistrationInfo = {
    credentialID: Buffer.from(
      testAuthenticatorEntity1.credentialId,
      'base64url',
    ),
    credentialPublicKey: Buffer.from(
      testAuthenticatorEntity1.credentialPublicKey,
      'base64url',
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
          provide: EntityManager,
          useValue: createMock<EntityManager>({
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
          provide: UserService,
          useValue: createMock<UserService>({
            update: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    service = module.get<AuthenticatorService>(AuthenticatorService);
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
    mockGenerateRegistrationOptions.mockReturnValue(
      testPublicKeyCredentialCreationOptions1,
    );
    mockVerifyRegistrationResponse.mockResolvedValue({
      verified: true,
      registrationInfo: testRegistrationInfo,
    });
    mockAuthenticatorEntity.mockReturnValue(testAuthenticatorEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('generateOptions', () => {
    it('should generate registraiont options', async () => {
      await expect(service.generateOptions(testUserEntity1)).resolves.toEqual(
        testPublicKeyCredentialCreationOptions1,
      );
      expect(em.find).toHaveBeenCalledTimes(1);
      expect(em.find).toHaveBeenCalledWith(AuthenticatorEntity, {
        user: { email: testUserEntity1.email },
      });
      expect(mockGenerateRegistrationOptions).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith(testUserEntity1, {
        challenge: testPublicKeyCredentialCreationOptions1.challenge,
      });
    });
  });

  describe('create', () => {
    it('should create an authenticator', async () => {
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1),
      ).resolves.toEqual(testAuthenticatorEntity1);
      expect(mockVerifyRegistrationResponse).toHaveBeenCalledTimes(1);
      expect(mockAuthenticatorEntity).toHaveBeenCalledTimes(1);
      expect(mockAuthenticatorEntity).toHaveBeenCalledWith(
        testRegistrationInfo.credentialID.toString('base64url'),
        testRegistrationInfo.credentialPublicKey.toString('base64url'),
        testRegistrationInfo.counter,
        testRegistrationInfo.credentialDeviceType,
        testRegistrationInfo.credentialBackedUp,
        null,
        testUserEntity1,
      );
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testAuthenticatorEntity1);
    });

    it('should throw a BadRequestException if challenge is not defined', async () => {
      await expect(
        service.create(testRegistrationResponse1, {
          ...testUserEntity1,
          challenge: null,
        }),
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
    });

    it('should throw a BadRequestException if challenge cannot be verified', async () => {
      mockVerifyRegistrationResponse.mockResolvedValue({ verified: false });
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1),
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
      expect(mockVerifyRegistrationResponse).toHaveBeenCalledTimes(1);
    });

    it('should throw a BadRequestException if challenge is verified without registrationInfo', async () => {
      mockVerifyRegistrationResponse.mockResolvedValue({ verified: true });
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1),
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
    });

    it('should throw a BadRequestException if persistAndFlush throws a UniqueConstraintViolationException', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1),
      ).rejects.toThrow(new BadRequestException(authenticatorTakenBadRequest));
      expect(mockVerifyRegistrationResponse).toHaveBeenCalledTimes(1);
      expect(mockAuthenticatorEntity).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testRegistrationResponse1, testUserEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(mockVerifyRegistrationResponse).toHaveBeenCalledTimes(1);
      expect(mockAuthenticatorEntity).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByUser', () => {
    afterEach(() => {
      expect(em.find).toHaveBeenCalledTimes(1);
      expect(em.find).toHaveBeenCalledWith(AuthenticatorEntity, {
        user: testUserEntity1,
      });
    });

    it('should get an array of authenticators by user', async () => {
      await expect(service.findAllByUser(testUserEntity1)).resolves.toEqual([
        testAuthenticatorEntity1,
      ]);
    });

    it('should throw an InternalServerErrorException if find throws an error', async () => {
      jest.spyOn(em, 'find').mockRejectedValue(new Error('find'));
      await expect(service.findAllByUser(testUserEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('findAllByEmail', () => {
    afterEach(() => {
      expect(em.find).toHaveBeenCalledTimes(1);
      expect(em.find).toHaveBeenCalledWith(AuthenticatorEntity, {
        user: { email: testUserEntity1.email },
      });
    });

    it('should get an array of authenticators by user email', async () => {
      await expect(
        service.findAllByEmail(testUserEntity1.email),
      ).resolves.toEqual([testAuthenticatorEntity1]);
    });

    it('should throw an InternalServerErrorException if find throws an error', async () => {
      jest.spyOn(em, 'find').mockRejectedValue(new Error('find'));
      await expect(
        service.findAllByEmail(testUserEntity1.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        AuthenticatorEntity,
        testAuthenticatorEntity1.id,
      );
    });

    it('should get a single authenticator by ID', async () => {
      await expect(
        service.findOneById(testAuthenticatorEntity1.id),
      ).resolves.toEqual(testAuthenticatorEntity1);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneById(testAuthenticatorEntity1.id),
      ).rejects.toThrow(new NotFoundException(authenticatorIdNotFound));
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneById(testAuthenticatorEntity1.id),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneByCredentialId', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(AuthenticatorEntity, {
        credentialId: testAuthenticatorEntity1.credentialId,
      });
    });

    it('should get a single authenticator by credential ID', async () => {
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId),
      ).resolves.toEqual(testAuthenticatorEntity1);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId),
      ).rejects.toThrow(
        new NotFoundException(authenticatorCredentialIdNotFound),
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('updateCounterById', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        AuthenticatorEntity,
        testAuthenticatorEntity1.id,
      );
    });

    it('should update an authenticator by ID', async () => {
      await expect(
        service.updateCounterById(
          testAuthenticatorEntity1.id,
          testCounter,
          testUserEntity1.id,
        ),
      ).resolves.toEqual({ ...testAuthenticatorEntity1, counter: testCounter });
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testAuthenticatorEntity1, {
        counter: testCounter,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it(`should throw a ForbiddenException if authenticator's user ID doesn't match the provider user ID`, async () => {
      await expect(
        service.updateCounterById(
          testAuthenticatorEntity1.id,
          testCounter,
          'badVal',
        ),
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.updateCounterById(
          testAuthenticatorEntity1.id,
          testCounter,
          testUserEntity1.id,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('updateNameById', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        AuthenticatorEntity,
        testAuthenticatorEntity1.id,
      );
    });

    it('should update an authenticator by ID', async () => {
      jest
        .spyOn(em, 'assign')
        .mockReturnValue({ ...testAuthenticatorEntity1, name: testName });
      await expect(
        service.updateNameById(
          testAuthenticatorEntity1.id,
          testName,
          testUserEntity1.id,
        ),
      ).resolves.toEqual({ ...testAuthenticatorEntity1, name: testName });
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testAuthenticatorEntity1, {
        name: testName,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it(`should throw a ForbiddenException if authenticator's user ID doesn't match the provider user ID`, async () => {
      await expect(
        service.updateNameById(testAuthenticatorEntity1.id, testName, 'badVal'),
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.updateNameById(
          testAuthenticatorEntity1.id,
          testName,
          testUserEntity1.id,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('deleteOneById', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        AuthenticatorEntity,
        testAuthenticatorEntity1.id,
      );
    });

    it('should delete a single authenticator by ID', async () => {
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id, testUserEntity1.id),
      ).resolves.toBeUndefined();
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(
        testAuthenticatorEntity1,
      );
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testAuthenticatorEntity1);
    });

    it(`should throw a ForbiddenException if authenticator's user ID doesn't match the provider user ID`, async () => {
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id, 'badVal'),
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id, testUserEntity1.id),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });
});
