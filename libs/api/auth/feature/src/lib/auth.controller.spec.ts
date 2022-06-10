import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { MagicLinkLoginStrategy } from '@newbee/api/auth/data-access';
import { MagicLinkLoginLoginDto } from '@newbee/api/auth/util';
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

describe('AuthController', () => {
  let controller: AuthController;
  let service: UserService;
  let strategy: MagicLinkLoginStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: createMock<UserService>({
            create: jest.fn().mockResolvedValue(oneUser),
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
    service = module.get<UserService>(UserService);
    strategy = module.get<MagicLinkLoginStrategy>(MagicLinkLoginStrategy);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('should send a link to the user', async () => {
      const magicLoginLoginDto: MagicLinkLoginLoginDto = {
        email: testEmail1,
      };
      await expect(
        controller.checkAndLogin(magicLoginLoginDto)
      ).resolves.toBeUndefined();
      expect(service.findOneByEmail).toBeCalledTimes(1);
      expect(service.findOneByEmail).toBeCalledWith(testEmail1);
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith({ email: testEmail1 });
    });
  });

  describe('register() without create', () => {
    it(`shouldn't create a user and send a link`, async () => {
      await expect(
        controller.checkAndRegister(createUserDto1)
      ).rejects.toThrow();
      expect(service.create).not.toBeCalled();
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith({ email: testEmail1 });
    });
  });

  describe('register() with create', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
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
      service = module.get<UserService>(UserService);
      strategy = module.get<MagicLinkLoginStrategy>(MagicLinkLoginStrategy);
    });
    it('should create a user and send a link', async () => {
      await expect(
        controller.checkAndRegister(createUserDto1)
      ).resolves.toBeUndefined();
      expect(service.findOneByEmail).toBeCalledTimes(1);
      expect(service.findOneByEmail).toBeCalledWith(testEmail1);
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(createUserDto1);
    });
  });
});
