import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { testUserJwtPayload1 } from '@newbee/api/auth/util';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import {
  testAuthenticatorEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  authenticatorVerifyBadRequest,
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
  let userService: UserService;
  let authenticatorService: AuthenticatorService;

  const testAccessToken = 'access';
  const testCounter = 100;
  const testAuthenticationInfo = {
    credentialID: Buffer.from(
      testAuthenticatorEntity1.credentialId,
      'base64url',
    ),
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
            sign: jest.fn().mockReturnValue(testAccessToken),
            verify: jest.fn().mockReturnValue({ sub: testUserEntity1.id }),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>({
            findOneById: jest.fn().mockResolvedValue(testUserEntity1),
            findOneByEmail: jest.fn().mockResolvedValue(testUserEntity1),
            update: jest.fn().mockResolvedValue(testUserEntity1),
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
            updateCounterById: jest.fn().mockResolvedValue({
              ...testAuthenticatorEntity1,
              counter: testCounter,
            }),
          }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    authenticatorService =
      module.get<AuthenticatorService>(AuthenticatorService);

    jest.clearAllMocks();
    mockGenerateAuthenticationOptions.mockReturnValue(
      testPublicKeyCredentialRequestOptions1,
    );
    mockVerifyAuthenticationResponse.mockResolvedValue({
      verified: true,
      authenticationInfo: testAuthenticationInfo,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userService).toBeDefined();
    expect(authenticatorService).toBeDefined();
  });

  describe('login', () => {
    it('should generate an access token', () => {
      expect(service.login(testUserEntity1)).toEqual(testAccessToken);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(testUserJwtPayload1);
    });
  });

  describe('verifyAuthToken', () => {
    it('should verify an auth token', async () => {
      await expect(service.verifyAuthToken(testAccessToken)).resolves.toEqual(
        testUserEntity1,
      );
      expect(userService.findOneById).toHaveBeenCalledTimes(1);
      expect(userService.findOneById).toHaveBeenCalledWith(testUserEntity1.id);
    });

    it('should return null if verify throws an error', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('verify');
      });
      await expect(
        service.verifyAuthToken(testAccessToken),
      ).resolves.toBeNull();
      expect(userService.findOneById).not.toHaveBeenCalled();
    });
  });

  describe('generateLoginChallenge', () => {
    it('should generate a login challenge', async () => {
      await expect(
        service.generateLoginChallenge(testUserEntity1.email),
      ).resolves.toEqual(testPublicKeyCredentialRequestOptions1);
      expect(authenticatorService.findAllByEmail).toHaveBeenCalledTimes(1);
      expect(authenticatorService.findAllByEmail).toHaveBeenCalledWith(
        testUserEntity1.email,
      );
      expect(mockGenerateAuthenticationOptions).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        testUserEntity1.email,
      );
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith(testUserEntity1, {
        challenge: testPublicKeyCredentialRequestOptions1.challenge,
      });
    });
  });

  describe('verifyLoginChallenge', () => {
    afterEach(() => {
      expect(userService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(
        testUserEntity1.email,
      );
    });

    it('should verify a login challenge and return the user', async () => {
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1,
        ),
      ).resolves.toEqual(testUserEntity1);
      expect(authenticatorService.findOneByCredentialId).toHaveBeenCalledTimes(
        1,
      );
      expect(authenticatorService.findOneByCredentialId).toHaveBeenCalledWith(
        testAuthenticationCredential1.id,
      );
      expect(mockVerifyAuthenticationResponse).toHaveBeenCalledTimes(1);
      expect(authenticatorService.updateCounterById).toHaveBeenCalledTimes(1);
      expect(authenticatorService.updateCounterById).toHaveBeenCalledWith(
        testAuthenticatorEntity1.id,
        testCounter,
        testUserEntity1.id,
      );
    });

    it('should throw a BadRequestException if challenge is falsy', async () => {
      jest
        .spyOn(userService, 'findOneByEmail')
        .mockResolvedValue({ ...testUserEntity1, challenge: null });
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1,
        ),
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
    });

    it('should throw a BadRequestException if verify encounters an error', async () => {
      mockVerifyAuthenticationResponse.mockRejectedValue(new Error('verify'));
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1,
        ),
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
      expect(authenticatorService.findOneByCredentialId).toHaveBeenCalledTimes(
        1,
      );
      expect(authenticatorService.findOneByCredentialId).toHaveBeenCalledWith(
        testAuthenticationCredential1.id,
      );
      expect(mockVerifyAuthenticationResponse).toHaveBeenCalledTimes(1);
    });

    it('should throw a BadRequestException if not verified', async () => {
      mockVerifyAuthenticationResponse.mockResolvedValue({
        verified: false,
        authenticationInfo: testAuthenticationInfo,
      });
      await expect(
        service.verifyLoginChallenge(
          testUserEntity1.email,
          testAuthenticationCredential1,
        ),
      ).rejects.toThrow(new BadRequestException(authenticatorVerifyBadRequest));
      expect(authenticatorService.findOneByCredentialId).toHaveBeenCalledTimes(
        1,
      );
      expect(authenticatorService.findOneByCredentialId).toHaveBeenCalledWith(
        testAuthenticationCredential1.id,
      );
      expect(mockVerifyAuthenticationResponse).toHaveBeenCalledTimes(1);
    });
  });
});
