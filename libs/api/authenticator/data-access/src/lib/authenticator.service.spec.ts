import { createMock } from '@golevelup/ts-jest';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthenticatorEntity,
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
            findOne: jest.fn().mockResolvedValue(testAuthenticatorEntity1),
            getReference: jest.fn().mockReturnValue(testAuthenticatorEntity1),
            assign: jest.fn().mockReturnValue({
              ...testAuthenticatorEntity1,
              counter: testCounter,
            }),
          }),
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

    service = module.get(AuthenticatorService);
    em = module.get(EntityManager);
    userService = module.get(UserService);

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
    expect(userService).toBeDefined();
  });

  describe('generateOptions', () => {
    it('should generate registration options', async () => {
      await expect(service.generateOptions(testUserEntity1)).resolves.toEqual(
        testPublicKeyCredentialCreationOptions1,
      );
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith(testUserEntity1, {
        challenge: testPublicKeyCredentialCreationOptions1.challenge,
      });
      expect(em.find).toHaveBeenCalledTimes(1);
      expect(em.find).toHaveBeenCalledWith(AuthenticatorEntity, {
        user: { email: testUserEntity1.email },
      });
      expect(mockGenerateRegistrationOptions).toHaveBeenCalledTimes(1);
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
  });

  describe('findAllByUser', () => {
    it('should get an array of authenticators by user', async () => {
      await expect(service.findAllByUser(testUserEntity1)).resolves.toEqual([
        testAuthenticatorEntity1,
      ]);
      expect(em.find).toHaveBeenCalledTimes(1);
      expect(em.find).toHaveBeenCalledWith(AuthenticatorEntity, {
        user: testUserEntity1,
      });
    });
  });

  describe('findAllByEmail', () => {
    it('should get an array of authenticators by user email', async () => {
      await expect(
        service.findAllByEmail(testUserEntity1.email),
      ).resolves.toEqual([testAuthenticatorEntity1]);
      expect(em.find).toHaveBeenCalledTimes(1);
      expect(em.find).toHaveBeenCalledWith(AuthenticatorEntity, {
        user: { email: testUserEntity1.email },
      });
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(
        AuthenticatorEntity,
        testAuthenticatorEntity1.id,
      );
    });

    it('should get a single authenticator by ID', async () => {
      await expect(
        service.findOneById(testAuthenticatorEntity1.id),
      ).resolves.toEqual(testAuthenticatorEntity1);
    });

    it('should throw a NotFoundException if authenticator cannot be found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOneById(testAuthenticatorEntity1.id),
      ).rejects.toThrow(new NotFoundException(authenticatorIdNotFound));
    });
  });

  describe('findOneByCredentialId', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(AuthenticatorEntity, {
        credentialId: testAuthenticatorEntity1.credentialId,
      });
    });

    it('should get a single authenticator by credential ID', async () => {
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId),
      ).resolves.toEqual(testAuthenticatorEntity1);
    });

    it('should throw a NotFoundException if authenticator cannot be found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId),
      ).rejects.toThrow(
        new NotFoundException(authenticatorCredentialIdNotFound),
      );
    });
  });

  describe('updateCounterById', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(
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
  });

  describe('updateNameById', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(
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
  });

  describe('deleteOneById', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(
        AuthenticatorEntity,
        testAuthenticatorEntity1.id,
      );
    });

    it('should delete a single authenticator by ID', async () => {
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id, testUserEntity1.id),
      ).resolves.toBeUndefined();
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testAuthenticatorEntity1);
    });

    it(`should throw a ForbiddenException if authenticator's user ID doesn't match the provider user ID`, async () => {
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id, 'badVal'),
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });
  });
});
