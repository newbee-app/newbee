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
  testCreateUserDto1,
  testLoginDto1,
  testMagicLinkLoginDto1,
  testMagicLinkLoginLoginDto1,
  testUserCreatedDto1,
} from '@newbee/shared/data-access';
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
          provide: AuthService,
          useValue: createMock<AuthService>({
            login: jest.fn().mockReturnValue(testLoginDto1),
          }),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>({
            create: jest.fn().mockResolvedValue(testUserAndOptions1),
          }),
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
    strategy = module.get<MagicLinkLoginStrategy>(MagicLinkLoginStrategy);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
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

  describe('magicLinkLoginLogin', () => {
    it('should send a link to the user', async () => {
      await expect(
        controller.magicLinkLoginLogin(testMagicLinkLoginLoginDto1)
      ).resolves.toEqual(testMagicLinkLoginDto1);
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith({
        email: testMagicLinkLoginLoginDto1.email,
      });
    });
  });

  describe('magicLinkLogin', () => {
    it('should return a token', () => {
      expect(controller.magicLinkLogin(testUserEntity1)).toEqual(testLoginDto1);
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(testUserEntity1);
    });
  });
});
