import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  AuthService,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import {
  testUserAndOptionsDto1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  testBaseCreateUserDto1,
  testBaseEmailDto1,
  testBaseMagicLinkLoginDto1,
  testBaseWebAuthnLoginDto1,
} from '@newbee/shared/data-access';
import { testPublicKeyCredentialRequestOptions1 } from '@newbee/shared/util';
import type { Response } from 'express';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userService: UserService;
  let strategy: MagicLinkLoginStrategy;
  let response: Response;

  const testAccessToken = 'access';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: createMock<UserService>({
            create: jest.fn().mockResolvedValue(testUserAndOptionsDto1),
          }),
        },
        {
          provide: AuthService,
          useValue: createMock<AuthService>({
            login: jest.fn().mockReturnValue(testAccessToken),
            generateLoginChallenge: jest
              .fn()
              .mockResolvedValue(testPublicKeyCredentialRequestOptions1),
            verifyLoginChallenge: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
        {
          provide: MagicLinkLoginStrategy,
          useValue: createMock<MagicLinkLoginStrategy>({
            send: jest.fn().mockResolvedValue(testBaseMagicLinkLoginDto1.jwtId),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: jest.fn().mockReturnValue({}),
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    strategy = module.get<MagicLinkLoginStrategy>(MagicLinkLoginStrategy);

    response = createMock<Response>();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(strategy).toBeDefined();
  });

  describe('webAuthnRegister', () => {
    it('should create a new user and options', async () => {
      await expect(
        controller.webAuthnRegister(response, testBaseCreateUserDto1)
      ).resolves.toEqual(testUserAndOptionsDto1);
      expect(userService.create).toBeCalledTimes(1);
      expect(userService.create).toBeCalledWith(testBaseCreateUserDto1);
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(testUserAndOptionsDto1.user);
    });
  });

  describe('webAuthnLoginOptions', () => {
    it('should create login challenge options', async () => {
      await expect(
        controller.webAuthnLoginOptions(testBaseEmailDto1)
      ).resolves.toEqual(testPublicKeyCredentialRequestOptions1);
      expect(service.generateLoginChallenge).toBeCalledTimes(1);
      expect(service.generateLoginChallenge).toBeCalledWith(
        testBaseEmailDto1.email
      );
    });
  });

  describe('webAuthnLogin', () => {
    it('should return a LoginDto', async () => {
      await expect(
        controller.webAuthnLogin(response, testBaseWebAuthnLoginDto1)
      ).resolves.toEqual(testUserEntity1);
      expect(service.verifyLoginChallenge).toBeCalledTimes(1);
      expect(service.verifyLoginChallenge).toBeCalledWith(
        testBaseWebAuthnLoginDto1.email,
        testBaseWebAuthnLoginDto1.response
      );
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(testUserEntity1);
    });
  });

  describe('magicLinkLoginLogin', () => {
    it('should send a link to the user', async () => {
      await expect(
        controller.magicLinkLoginLogin(testBaseEmailDto1)
      ).resolves.toEqual(testBaseMagicLinkLoginDto1);
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith({
        email: testBaseEmailDto1.email,
      });
    });
  });

  describe('magicLinkLogin', () => {
    it('should return an access token', () => {
      expect(controller.magicLinkLogin(response, testUserEntity1)).toEqual(
        testUserEntity1
      );
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(testUserEntity1);
    });
  });
});
