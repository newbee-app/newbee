import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  AuthService,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { EntityService, testUserEntity1 } from '@newbee/api/shared/data-access';
import { authJwtCookie } from '@newbee/api/shared/util';
import type { UserAndOptions } from '@newbee/api/user/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  internalServerError,
  testBaseCreateUserDto1,
  testBaseEmailDto1,
  testBaseMagicLinkLoginDto1,
  testBaseUserRelationAndOptionsDto1,
  testBaseWebAuthnLoginDto1,
  testPublicKeyCredentialCreationOptions1,
  testPublicKeyCredentialRequestOptions1,
  testUserRelation1,
} from '@newbee/shared/util';
import type { Response } from 'express';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let entityService: EntityService;
  let userService: UserService;
  let strategy: MagicLinkLoginStrategy;
  let response: Response;

  const testAccessToken = 'access';
  const testUserAndOptions: UserAndOptions = {
    user: testUserEntity1,
    options: testPublicKeyCredentialCreationOptions1,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createUserRelation: jest.fn().mockResolvedValue(testUserRelation1),
          }),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>({
            create: jest.fn().mockResolvedValue(testUserAndOptions),
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
    entityService = module.get<EntityService>(EntityService);
    userService = module.get<UserService>(UserService);
    strategy = module.get<MagicLinkLoginStrategy>(MagicLinkLoginStrategy);

    response = createMock<Response>();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(entityService).toBeDefined();
    expect(userService).toBeDefined();
    expect(strategy).toBeDefined();
  });

  describe('webAuthnRegister', () => {
    it('should create a new user and options', async () => {
      await expect(
        controller.webAuthnRegister(response, testBaseCreateUserDto1),
      ).resolves.toEqual(testBaseUserRelationAndOptionsDto1);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(testBaseCreateUserDto1);
      expect(service.login).toHaveBeenCalledTimes(1);
      expect(service.login).toHaveBeenCalledWith(testUserAndOptions.user);
      expect(entityService.createUserRelation).toHaveBeenCalledTimes(1);
      expect(entityService.createUserRelation).toHaveBeenCalledWith(
        testUserEntity1,
      );
    });
  });

  describe('webAuthnLoginOptions', () => {
    it('should create login challenge options', async () => {
      await expect(
        controller.webAuthnLoginOptions(testBaseEmailDto1),
      ).resolves.toEqual(testPublicKeyCredentialRequestOptions1);
      expect(service.generateLoginChallenge).toHaveBeenCalledTimes(1);
      expect(service.generateLoginChallenge).toHaveBeenCalledWith(
        testBaseEmailDto1.email,
      );
    });
  });

  describe('webAuthnLogin', () => {
    it('should return a LoginDto', async () => {
      await expect(
        controller.webAuthnLogin(response, testBaseWebAuthnLoginDto1),
      ).resolves.toEqual(testUserRelation1);
      expect(service.verifyLoginChallenge).toHaveBeenCalledTimes(1);
      expect(service.verifyLoginChallenge).toHaveBeenCalledWith(
        testBaseWebAuthnLoginDto1.email,
        testBaseWebAuthnLoginDto1.response,
      );
      expect(service.login).toHaveBeenCalledTimes(1);
      expect(service.login).toHaveBeenCalledWith(testUserEntity1);
      expect(entityService.createUserRelation).toHaveBeenCalledTimes(1);
      expect(entityService.createUserRelation).toHaveBeenCalledWith(
        testUserEntity1,
      );
    });
  });

  describe('magicLinkLoginLogin', () => {
    afterEach(() => {
      expect(strategy.send).toHaveBeenCalledTimes(1);
      expect(strategy.send).toHaveBeenCalledWith({
        email: testBaseEmailDto1.email,
      });
    });

    it('should send a link to the user', async () => {
      await expect(
        controller.magicLinkLoginLogin(testBaseEmailDto1),
      ).resolves.toEqual(testBaseMagicLinkLoginDto1);
    });

    it('should throw an InternalServerErrorException if send throws an error', async () => {
      jest.spyOn(strategy, 'send').mockRejectedValue(new Error('send'));
      await expect(
        controller.magicLinkLoginLogin(testBaseEmailDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('magicLinkLogin', () => {
    it('should return an access token', async () => {
      await expect(
        controller.magicLinkLogin(response, testUserEntity1),
      ).resolves.toEqual(testUserRelation1);
      expect(service.login).toHaveBeenCalledTimes(1);
      expect(service.login).toHaveBeenCalledWith(testUserEntity1);
      expect(entityService.createUserRelation).toHaveBeenCalledTimes(1);
      expect(entityService.createUserRelation).toHaveBeenCalledWith(
        testUserEntity1,
      );
    });
  });

  describe('logout', () => {
    it('should call clearCookie', () => {
      expect(controller.logout(response, testUserEntity1)).toBeUndefined();
      expect(response.clearCookie).toHaveBeenCalledTimes(1);
      expect(response.clearCookie).toHaveBeenCalledWith(authJwtCookie, {});
    });
  });
});
