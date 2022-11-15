import { createMock } from '@golevelup/ts-jest';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import {
  testAuthenticatorEntity1,
  testUserChallengeEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  badRequestAuthenticatorErrorMsg,
  internalServerErrorMsg,
  testUserJwtPayload1,
} from '@newbee/api/shared/util';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';
import { testLoginDto1 } from '@newbee/shared/data-access';
import {
  testAuthenticationCredential1,
  testPublicKeyCredentialRequestOptions1,
} from '@newbee/shared/util';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { AuthService } from './auth.service';

jest.mock('@simplewebauthn/server', () => ({
  __esModule: true,
  generateAuthenticationOptions: jest.fn(),
  verifyAuthenticationResponse: jest.fn(),
}));
const mockGenerateAuthenticationOptions =
  generateAuthenticationOptions as jest.Mock;
const mockVerifyAuthenticationResponse =
  verifyAuthenticationResponse as jest.Mock;

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let authenticatorService: AuthenticatorService;
  let userChallengeService: UserChallengeService;

  const testCounter = 100;
  const testAuthenticationInfo = {
    credentialID: Buffer.from(testAuthenticatorEntity1.credentialId),
    newCounter: testCounter,
    userVerified: true,
    credentialDeviceType: testAuthenticatorEntity1.credentialDeviceType,
    credentialBackedUp: testAuthenticatorEntity1.credentialBackedUp,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: createMock<JwtService>({
            sign: jest.fn().mockReturnValue(testLoginDto1.access_token),
          }),
        },
        {
          provide: AuthenticatorService,
          useValue: createMock<AuthenticatorService>({
            findAllByEmail: jest
              .fn()
              .mockResolvedValue([testAuthenticatorEntity1]),
            findOneByCredentialId: jest
              .fn()
              .mockResolvedValue(testAuthenticatorEntity1),
            updateById: jest.fn().mockResolvedValue({
              ...testAuthenticatorEntity1,
              counter: testCounter,
            }),
          }),
        },
        {
          provide: UserChallengeService,
          useValue: createMock<UserChallengeService>({
            updateByEmail: jest.fn().mockResolvedValue({
              ...testUserChallengeEntity1,
              challenge: 'challenge2',
            }),
            findOneByEmail: jest
              .fn()
              .mockResolvedValue(testUserChallengeEntity1),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    authenticatorService =
      module.get<AuthenticatorService>(AuthenticatorService);
    userChallengeService =
      module.get<UserChallengeService>(UserChallengeService);

    mockGenerateAuthenticationOptions.mockReturnValue(
      testPublicKeyCredentialRequestOptions1
    );
    mockVerifyAuthenticationResponse.mockResolvedValue({
      verified: true,
      authenticationInfo: testAuthenticationInfo,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(authenticatorService).toBeDefined();
    expect(userChallengeService).toBeDefined();
  });

  describe('login', () => {
    it('should generate an access token', () => {
      expect(service.login(testUserEntity1)).toEqual(testLoginDto1);
      expect(jwtService.sign).toBeCalledTimes(1);
      expect(jwtService.sign).toBeCalledWith(testUserJwtPayload1);
    });
  });

  describe('generateLoginChallenge', () => {
    it('should generate a login challenge', async () => {
      await expect(
        service.generateLoginChallenge(testUserEntity1.email)
      ).resolves.toEqual(testPublicKeyCredentialRequestOptions1);
      expect(authenticatorService.findAllByEmail).toBeCalledTimes(1);
      expect(authenticatorService.findAllByEmail).toBeCalledWith(
        testUserEntity1.email
      );
      expect(mockGenerateAuthenticationOptions).toBeCalledTimes(1);
      expect(userChallengeService.updateByEmail).toBeCalledTimes(1);
      expect(userChallengeService.updateByEmail).toBeCalledWith(
        testUserEntity1.email,
        testPublicKeyCredentialRequestOptions1.challenge
      );
    });
  });

  describe('verifyLoginChallenge', () => {
    afterEach(() => {
      expect(userChallengeService.findOneByEmail).toBeCalledTimes(1);
      expect(userChallengeService.findOneByEmail).toBeCalledWith(
        testUserEntity1.email
      );
    });

    it('should verify a login challenge and return the user', async () => {
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1
        )
      ).resolves.toEqual(testUserEntity1);
      expect(authenticatorService.findOneByCredentialId).toBeCalledTimes(1);
      expect(authenticatorService.findOneByCredentialId).toBeCalledWith(
        testAuthenticationCredential1.id
      );
      expect(authenticatorService.updateById).toBeCalledTimes(1);
      expect(authenticatorService.updateById).toBeCalledWith(
        testAuthenticatorEntity1.id,
        testCounter
      );
    });

    it('should throw an InternalServerErrorException if user challenge does not exist', async () => {
      jest
        .spyOn(userChallengeService, 'findOneByEmail')
        .mockResolvedValue(null);
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1
        )
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });

    it('should throw a BadRequestException if challenge is falsy', async () => {
      jest
        .spyOn(userChallengeService, 'findOneByEmail')
        .mockResolvedValue({ ...testUserChallengeEntity1, challenge: null });
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1
        )
      ).rejects.toThrow(
        new BadRequestException(badRequestAuthenticatorErrorMsg)
      );
    });

    it('should throw a BadRequestException if authenticator cannot be found', async () => {
      jest
        .spyOn(authenticatorService, 'findOneByCredentialId')
        .mockResolvedValue(null);
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1
        )
      ).rejects.toThrow(
        new BadRequestException(badRequestAuthenticatorErrorMsg)
      );
      expect(authenticatorService.findOneByCredentialId).toBeCalledTimes(1);
      expect(authenticatorService.findOneByCredentialId).toBeCalledWith(
        testAuthenticationCredential1.id
      );
    });

    it('should throw a BadRequestException if verify encounters an error', async () => {
      mockVerifyAuthenticationResponse.mockRejectedValue(new Error('verify'));
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1
        )
      ).rejects.toThrow(
        new BadRequestException(badRequestAuthenticatorErrorMsg)
      );
      expect(authenticatorService.findOneByCredentialId).toBeCalledTimes(1);
      expect(authenticatorService.findOneByCredentialId).toBeCalledWith(
        testAuthenticationCredential1.id
      );
    });

    it('should throw a BadRequestException if not verified', async () => {
      mockVerifyAuthenticationResponse.mockResolvedValue({
        verified: false,
        authenticationInfo: testAuthenticationInfo,
      });
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1
        )
      ).rejects.toThrow(
        new BadRequestException(badRequestAuthenticatorErrorMsg)
      );
      expect(authenticatorService.findOneByCredentialId).toBeCalledTimes(1);
      expect(authenticatorService.findOneByCredentialId).toBeCalledWith(
        testAuthenticationCredential1.id
      );
    });
  });
});
