import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import {
  AuthService,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import {
  testCreateUserDto1,
  testLoginDto1,
  testMagicLinkLoginDto1,
  testMagicLinkLoginLoginDto1,
} from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userService: UserService;
  let strategy: MagicLinkLoginStrategy;

  describe('returning user', () => {
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

    describe('login()', () => {
      it('should send a link to the user', async () => {
        await expect(
          controller.login(testMagicLinkLoginLoginDto1)
        ).resolves.toEqual(testMagicLinkLoginDto1);
        expect(userService.findOneByEmail).toBeCalledTimes(1);
        expect(userService.findOneByEmail).toBeCalledWith(testUser1.email);
        expect(strategy.send).toBeCalledTimes(1);
        expect(strategy.send).toBeCalledWith({ email: testUser1.email });
      });
    });

    describe('register()', () => {
      it(`shouldn't create a user, but should send a link`, async () => {
        await expect(controller.register(testCreateUserDto1)).resolves.toEqual(
          testMagicLinkLoginDto1
        );
        expect(userService.create).not.toBeCalled();
        expect(strategy.send).toBeCalledTimes(1);
        expect(strategy.send).toBeCalledWith({ email: testUser1.email });
      });
    });

    describe('magicLinkLogin()', () => {
      it('should return a token', () => {
        expect(controller.magicLinkLogin(testUserEntity1)).toEqual(
          testLoginDto1
        );
        expect(service.login).toBeCalledTimes(1);
        expect(service.login).toBeCalledWith(testUserEntity1);
      });
    });
  });

  describe('new user', () => {
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
              send: jest.fn().mockResolvedValue(testMagicLinkLoginDto1.jwtId),
            }),
          },
        ],
      }).compile();

      controller = module.get<AuthController>(AuthController);
      userService = module.get<UserService>(UserService);
      strategy = module.get<MagicLinkLoginStrategy>(MagicLinkLoginStrategy);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
      expect(userService).toBeDefined();
      expect(strategy).toBeDefined();
    });

    describe('register()', () => {
      it('should create a user and send a link', async () => {
        await expect(controller.register(testCreateUserDto1)).resolves.toEqual(
          testMagicLinkLoginDto1
        );
        expect(userService.findOneByEmail).toBeCalledTimes(1);
        expect(userService.findOneByEmail).toBeCalledWith(testUser1.email);
        expect(userService.create).toBeCalledTimes(1);
        expect(userService.create).toBeCalledWith(testCreateUserDto1);
      });
    });
  });
});
