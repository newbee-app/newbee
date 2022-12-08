import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import {
  AuthService,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { testUserAndOptions1 } from '@newbee/api/user/util';
import {
  testBaseCreateUserDto1,
  testBaseEmailDto1,
  testBaseLoginDto1,
  testBaseMagicLinkLoginDto1,
  testBaseUserCreatedDto1,
  testBaseWebAuthnLoginDto1,
} from '@newbee/shared/data-access';
import { testPublicKeyCredentialRequestOptions1 } from '@newbee/shared/util';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userService: UserService;
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
            login: jest.fn().mockReturnValue(testBaseLoginDto1),
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
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    strategy = module.get<MagicLinkLoginStrategy>(MagicLinkLoginStrategy);
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
        controller.webAuthnRegister(testBaseCreateUserDto1)
      ).resolves.toEqual(testBaseUserCreatedDto1);
      expect(userService.create).toBeCalledTimes(1);
      expect(userService.create).toBeCalledWith(testBaseCreateUserDto1);
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(testUserAndOptions1.user);
    });
  });

  describe('webAuthnLoginGet', () => {
    it('should create login challenge options', async () => {
      await expect(
        controller.webAuthnLoginGet(testBaseEmailDto1)
      ).resolves.toEqual(testPublicKeyCredentialRequestOptions1);
      expect(service.generateLoginChallenge).toBeCalledTimes(1);
      expect(service.generateLoginChallenge).toBeCalledWith(
        testBaseEmailDto1.email
      );
    });
  });

  describe('webAuthnLoginPost', () => {
    it('should return a LoginDto', async () => {
      await expect(
        controller.webAuthnLoginPost(testBaseWebAuthnLoginDto1)
      ).resolves.toEqual(testBaseLoginDto1);
      expect(service.verifyLoginChallenge).toBeCalledTimes(1);
      expect(service.verifyLoginChallenge).toBeCalledWith(
        testBaseWebAuthnLoginDto1.email,
        testBaseWebAuthnLoginDto1.credential
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
      expect(controller.magicLinkLogin(testUserEntity1)).toEqual(
        testBaseLoginDto1
      );
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(testUserEntity1);
    });
  });
});
