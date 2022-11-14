import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  AuthService,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import {
  testAuthenticatorEntity1,
  testUserChallengeEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { testUserAndOptions1 } from '@newbee/api/user/util';
import {
  testCreateUserDto1,
  testEmailDto1,
  testLoginDto1,
  testMagicLinkLoginDto1,
  testUserCreatedDto1,
} from '@newbee/shared/data-access';
import { testPublicKeyCredentialRequestOptions1 } from '@newbee/shared/util';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { AuthController } from './auth.controller';

jest.mock('@simplewebauthn/server', () => ({
  __esModule: true,
  generateAuthenticationOptions: jest.fn(),
}));
const mockGenerateAuthenticationOptions =
  generateAuthenticationOptions as jest.Mock;

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userService: UserService;
  let authenticatorService: AuthenticatorService;
  let userChallengeService: UserChallengeService;
  let strategy: MagicLinkLoginStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: createMock<UserService>({
            create: jest.fn().mockResolvedValue(testUserAndOptions1),
          }),
        },
        {
          provide: AuthService,
          useValue: createMock<AuthService>({
            login: jest.fn().mockReturnValue(testLoginDto1),
          }),
        },
        {
          provide: AuthenticatorService,
          useValue: createMock<AuthenticatorService>({
            findAllByEmail: jest
              .fn()
              .mockResolvedValue([testAuthenticatorEntity1]),
          }),
        },
        {
          provide: UserChallengeService,
          useValue: createMock<UserChallengeService>({
            updateByEmail: jest
              .fn()
              .mockResolvedValue(testUserChallengeEntity1),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
        {
          provide: MagicLinkLoginStrategy,
          useValue: createMock<MagicLinkLoginStrategy>({
            send: jest.fn().mockResolvedValue(testMagicLinkLoginDto1.jwtId),
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    authenticatorService =
      module.get<AuthenticatorService>(AuthenticatorService);
    userChallengeService =
      module.get<UserChallengeService>(UserChallengeService);
    strategy = module.get<MagicLinkLoginStrategy>(MagicLinkLoginStrategy);

    mockGenerateAuthenticationOptions.mockReturnValue(
      testPublicKeyCredentialRequestOptions1
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(authenticatorService).toBeDefined();
    expect(userChallengeService).toBeDefined();
    expect(strategy).toBeDefined();
  });

  describe('webauthnRegister', () => {
    it('should create a new user and options', async () => {
      await expect(
        controller.webauthnRegister(testCreateUserDto1)
      ).resolves.toEqual(testUserCreatedDto1);
      expect(userService.create).toBeCalledTimes(1);
      expect(userService.create).toBeCalledWith(testCreateUserDto1);
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(testUserAndOptions1.user);
    });
  });

  describe('webauthnLogin', () => {
    it('should create a PublicKeyCredentialRequestOptionsJSON', async () => {
      await expect(controller.webauthnLogin(testEmailDto1)).resolves.toEqual(
        testPublicKeyCredentialRequestOptions1
      );
      expect(authenticatorService.findAllByEmail).toBeCalledTimes(1);
      expect(authenticatorService.findAllByEmail).toBeCalledWith(
        testEmailDto1.email
      );
      expect(mockGenerateAuthenticationOptions).toBeCalledTimes(1);
      expect(userChallengeService.updateByEmail).toBeCalledTimes(1);
      expect(userChallengeService.updateByEmail).toBeCalledWith(
        testEmailDto1.email,
        testPublicKeyCredentialRequestOptions1.challenge
      );
    });
  });

  describe('magicLinkLoginLogin', () => {
    it('should send a link to the user', async () => {
      await expect(
        controller.magicLinkLoginLogin(testEmailDto1)
      ).resolves.toEqual(testMagicLinkLoginDto1);
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith({
        email: testEmailDto1.email,
      });
    });
  });

  describe('magicLinkLogin', () => {
    it('should return an access token', () => {
      expect(controller.magicLinkLogin(testUserEntity1)).toEqual(testLoginDto1);
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(testUserEntity1);
    });
  });
});
