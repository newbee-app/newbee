import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import {
  AuthService,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { UserEntity } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  CreateUserDto,
  LoginDto,
  MagicLinkLoginLoginDto,
} from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { AuthController } from './auth.controller';

const { fullName, ...rest } = testUser1;
fullName; // to shut up the unused var warning
const testUserEntity1 = new UserEntity(rest);
const testCreateUserDto1: CreateUserDto = Object.assign({}, testUser1);
const accessToken1 = 'access_token1';
const testLoginDto1: LoginDto = {
  access_token: accessToken1,
  user: testUserEntity1,
};

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
            findOneById: jest.fn().mockResolvedValue(testUserEntity1),
            findOneByEmail: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
        {
          provide: MagicLinkLoginStrategy,
          useValue: createMock<MagicLinkLoginStrategy>({
            send: jest.fn().mockResolvedValue(undefined),
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
  });

  describe('checkAndLogin()', () => {
    it('should send a link to the user', async () => {
      const magicLoginLoginDto: MagicLinkLoginLoginDto = {
        email: testUser1.email,
      };
      await expect(
        controller.checkAndLogin(magicLoginLoginDto)
      ).resolves.toBeUndefined();
      expect(userService.findOneByEmail).toBeCalledTimes(1);
      expect(userService.findOneByEmail).toBeCalledWith(testUser1.email);
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith({ email: testUser1.email });
    });
  });

  describe('checkAndRegister() without create', () => {
    it(`shouldn't create a user and send a link`, async () => {
      await expect(
        controller.checkAndRegister(testCreateUserDto1)
      ).rejects.toThrow();
      expect(userService.create).not.toBeCalled();
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith({ email: testUser1.email });
    });
  });

  describe('checkAndRegister() with create', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          {
            provide: AuthService,
            useValue: createMock<AuthService>(),
          },
          {
            provide: UserService,
            useValue: createMock<UserService>({
              create: jest.fn().mockResolvedValue(testUserEntity1),
              findOneByEmail: jest.fn().mockResolvedValue(null),
            }),
          },
          {
            provide: MagicLinkLoginStrategy,
            useValue: createMock<MagicLinkLoginStrategy>({
              send: jest.fn().mockResolvedValue(undefined),
            }),
          },
        ],
      }).compile();

      controller = module.get<AuthController>(AuthController);
      userService = module.get<UserService>(UserService);
      strategy = module.get<MagicLinkLoginStrategy>(MagicLinkLoginStrategy);
    });
    it('should create a user and send a link', async () => {
      await expect(
        controller.checkAndRegister(testCreateUserDto1)
      ).resolves.toBeUndefined();
      expect(userService.findOneByEmail).toBeCalledTimes(1);
      expect(userService.findOneByEmail).toBeCalledWith(testUser1.email);
      expect(userService.create).toBeCalledTimes(1);
      expect(userService.create).toBeCalledWith(testCreateUserDto1);
    });
  });

  describe('magicLinkLogin()', () => {
    it('should return a token', () => {
      expect(controller.magicLinkLogin(testUserEntity1)).toEqual(testLoginDto1);
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(testUserEntity1);
    });
  });
});
