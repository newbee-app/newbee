import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import {
  AuthService,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { LoginDto, MagicLinkLoginLoginDto } from '@newbee/api/auth/util';
import { User } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { CreateUserDto } from '@newbee/api/user/util';
import { AuthController } from './auth.controller';

const testId1 = '1';
const testEmail1 = 'johndoe@gmail.com';
const testFirstName1 = 'John';
const testLastName1 = 'Doe';
const createUserDto1: CreateUserDto = {
  email: testEmail1,
  firstName: testFirstName1,
  lastName: testLastName1,
};

const oneUser = new User({
  id: testId1,
  email: testEmail1,
  firstName: testFirstName1,
  lastName: testLastName1,
});

const accessToken1 = 'access_token1';

const oneLoginDto: LoginDto = { access_token: accessToken1, user: oneUser };

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
            login: jest.fn().mockReturnValue(oneLoginDto),
          }),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>({
            findOneById: jest.fn().mockResolvedValue(oneUser),
            findOneByEmail: jest.fn().mockResolvedValue(oneUser),
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
        email: testEmail1,
      };
      await expect(
        controller.checkAndLogin(magicLoginLoginDto)
      ).resolves.toBeUndefined();
      expect(userService.findOneByEmail).toBeCalledTimes(1);
      expect(userService.findOneByEmail).toBeCalledWith(testEmail1);
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith({ email: testEmail1 });
    });
  });

  describe('checkAndRegister() without create', () => {
    it(`shouldn't create a user and send a link`, async () => {
      await expect(
        controller.checkAndRegister(createUserDto1)
      ).rejects.toThrow();
      expect(userService.create).not.toBeCalled();
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith({ email: testEmail1 });
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
              create: jest.fn().mockResolvedValue(oneUser),
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
        controller.checkAndRegister(createUserDto1)
      ).resolves.toBeUndefined();
      expect(userService.findOneByEmail).toBeCalledTimes(1);
      expect(userService.findOneByEmail).toBeCalledWith(testEmail1);
      expect(userService.create).toBeCalledTimes(1);
      expect(userService.create).toBeCalledWith(createUserDto1);
    });
  });

  describe('magicLinkLogin()', () => {
    it('should return a token', () => {
      expect(controller.magicLinkLogin(oneUser)).toEqual(oneLoginDto);
      expect(service.login).toBeCalledTimes(1);
      expect(service.login).toBeCalledWith(oneUser);
    });
  });
});
