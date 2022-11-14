import { createMock } from '@golevelup/ts-jest';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  AuthenticatorEntity,
  testAuthenticatorEntity1,
  testUserChallengeEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { internalServerErrorMsg } from '@newbee/api/shared/util';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';
import { testRegistrationCredential1 } from '@newbee/shared/util';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { Repository } from 'typeorm';
import { AuthenticatorService } from './authenticator.service';

jest.mock('@simplewebauthn/server', () => ({
  __esModule: true,
  verifyRegistrationResponse: jest.fn(),
}));
const mockVerifyRegistrationResponse = verifyRegistrationResponse as jest.Mock;

describe('AuthenticatorService', () => {
  let service: AuthenticatorService;
  let repository: Repository<AuthenticatorEntity>;
  let userChallengeService: UserChallengeService;

  const testRegistrationInfo = {
    credentialID: Buffer.from(testAuthenticatorEntity1.credentialId),
    credentialPublicKey: testAuthenticatorEntity1.credentialPublicKey,
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
          useValue: createMock<Repository<AuthenticatorEntity>>({
            find: jest.fn().mockResolvedValue([testAuthenticatorEntity1]),
            findOne: jest.fn().mockResolvedValue(testAuthenticatorEntity1),
            save: jest.fn().mockResolvedValue(testAuthenticatorEntity1),
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
    repository = module.get<Repository<AuthenticatorEntity>>(
      getRepositoryToken(AuthenticatorEntity)
    );
    userChallengeService =
      module.get<UserChallengeService>(UserChallengeService);

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

  describe('create', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { credentialId: testRegistrationCredential1.id },
      });
    });

    it('should throw a BadRequestException if credential ID already exists', async () => {
      await expect(
        service.create(testRegistrationCredential1, testUserEntity1)
      ).rejects.toThrow(
        new BadRequestException(
          'The authenticator you are trying to register has already been registered to your account, try logging in instead!'
        )
      );
    });

    describe('credential does not already exist', () => {
      beforeEach(() => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      });

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
        expect(repository.save).toBeCalledTimes(1);
        expect(repository.save).toBeCalledWith(
          new AuthenticatorEntity({
            credentialId:
              testRegistrationInfo.credentialID.toString('base64url'),
            credentialPublicKey: testRegistrationInfo.credentialPublicKey,
            counter: testRegistrationInfo.counter,
            credentialDeviceType: testRegistrationInfo.credentialDeviceType,
            credentialBackedUp: testRegistrationInfo.credentialBackedUp,
            ...(testRegistrationCredential1.transports && {
              transports: testRegistrationCredential1.transports,
            }),
            user: testUserEntity1,
          })
        );
      });

      it('should throw an InternalServerErrorException if user challenge does not exist', async () => {
        jest.spyOn(userChallengeService, 'findOneById').mockResolvedValue(null);
        await expect(
          service.create(testRegistrationCredential1, testUserEntity1)
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerErrorMsg)
        );
      });

      it('should throw a BadRequestException if challenge is not defined', async () => {
        jest.spyOn(userChallengeService, 'findOneById').mockResolvedValue({
          userId: testUserEntity1.id,
          user: testUserEntity1,
        });
        await expect(
          service.create(testRegistrationCredential1, testUserEntity1)
        ).rejects.toThrow(
          new BadRequestException(
            'We could not verify this authenticator, please try the process over from the beginning!'
          )
        );
      });

      it('should throw a BadRequestException if challenge cannot be verified', async () => {
        mockVerifyRegistrationResponse.mockResolvedValue({ verified: false });
        await expect(
          service.create(testRegistrationCredential1, testUserEntity1)
        ).rejects.toThrow(
          new BadRequestException(
            'We could not verify this authenticator, please try the process over from the beginning!'
          )
        );
      });

      it('should throw a BadRequestException if challenge is verified without registrationInfo', async () => {
        mockVerifyRegistrationResponse.mockResolvedValue({ verified: true });
        await expect(
          service.create(testRegistrationCredential1, testUserEntity1)
        ).rejects.toThrow(
          new BadRequestException(
            'We could not verify this authenticator, please try the process over from the beginning!'
          )
        );
      });

      it('should throw an InternalServerErrorException if save throws an error', async () => {
        jest.spyOn(repository, 'save').mockRejectedValue(new Error('save'));
        await expect(
          service.create(testRegistrationCredential1, testUserEntity1)
        ).rejects.toThrow(
          new InternalServerErrorException(internalServerErrorMsg)
        );
        expect(repository.save).toBeCalledTimes(1);
        expect(repository.save).toBeCalledWith(
          new AuthenticatorEntity({
            credentialId:
              testRegistrationInfo.credentialID.toString('base64url'),
            credentialPublicKey: testRegistrationInfo.credentialPublicKey,
            counter: testRegistrationInfo.counter,
            credentialDeviceType: testRegistrationInfo.credentialDeviceType,
            credentialBackedUp: testRegistrationInfo.credentialBackedUp,
            ...(testRegistrationCredential1.transports && {
              transports: testRegistrationCredential1.transports,
            }),
            user: testUserEntity1,
          })
        );
      });
    });
  });

  describe('findAllByEmail', () => {
    afterEach(() => {
      expect(repository.find).toBeCalledTimes(1);
      expect(repository.find).toBeCalledWith({
        where: { user: { email: testUserEntity1.email } },
      });
    });

    it('should get an array of authenticators by user ID', async () => {
      await expect(
        service.findAllByEmail(testUserEntity1.email)
      ).resolves.toEqual([testAuthenticatorEntity1]);
    });

    it('should throw an InternalServerErrorException if find throws an error', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('find'));
      await expect(
        service.findAllByEmail(testUserEntity1.email)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { id: testAuthenticatorEntity1.id },
      });
    });

    it('should get a single authenticator by ID', async () => {
      await expect(
        service.findOneById(testAuthenticatorEntity1.id)
      ).resolves.toEqual(testAuthenticatorEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneById(testAuthenticatorEntity1.id)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('findOneByCredentialId', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { credentialId: testAuthenticatorEntity1.credentialId },
      });
    });

    it('should get a single authenticator by credential ID', async () => {
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId)
      ).resolves.toEqual(testAuthenticatorEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneByCredentialId(testAuthenticatorEntity1.credentialId)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('deleteOneById', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { id: testAuthenticatorEntity1.id },
      });
    });

    it('should delete a single authenticator by ID', async () => {
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id)
      ).resolves.toBeUndefined();
      expect(repository.remove).toBeCalledTimes(1);
      expect(repository.remove).toBeCalledWith(testAuthenticatorEntity1);
    });

    it('should throw an InternalServerErrorException if remove throws an error', async () => {
      jest.spyOn(repository, 'remove').mockRejectedValue(new Error('remove'));
      await expect(
        service.deleteOneById(testAuthenticatorEntity1.id)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.remove).toBeCalledTimes(1);
      expect(repository.remove).toBeCalledWith(testAuthenticatorEntity1);
    });
  });
});
