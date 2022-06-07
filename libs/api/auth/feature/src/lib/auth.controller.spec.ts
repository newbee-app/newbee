import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { MagicLoginStrategy } from '@newbee/api/auth/data-access';
import {
  MagicLoginLoginDto,
  MagicLoginRegisterDto,
} from '@newbee/api/auth/util';
import { User } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { CreateUserDto } from '@newbee/api/user/util';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';

const testId1 = '1';
const testEmail1 = 'johndoe@gmail.com';
const testFirstName1 = 'John';
const testLastName1 = 'Doe';

const oneUser = new User({
  id: testId1,
  email: testEmail1,
  firstName: testFirstName1,
  lastName: testLastName1,
});

const req = createMock<Request>();
const res = createMock<Response>();

describe('AuthController', () => {
  let controller: AuthController;
  let service: UserService;
  let strategy: MagicLoginStrategy;

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
          provide: MagicLoginStrategy,
          useValue: createMock<MagicLoginStrategy>({
            send: jest.fn().mockResolvedValue(undefined),
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<UserService>(UserService);
    strategy = module.get<MagicLoginStrategy>(MagicLoginStrategy);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('should send a link to the user', async () => {
      const magicLoginLoginDto: MagicLoginLoginDto = {
        destination: testEmail1,
      };
      await expect(
        controller.checkAndLogin(magicLoginLoginDto, req, res)
      ).resolves.toBeUndefined();
      expect(service.findOneByEmail).toBeCalledTimes(1);
      expect(service.findOneByEmail).toBeCalledWith(testEmail1);
      expect(strategy.send).toBeCalledTimes(1);
      expect(strategy.send).toBeCalledWith(req, res);
    });
  });

  describe('register()', () => {
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
            provide: MagicLoginStrategy,
            useValue: createMock<MagicLoginStrategy>({
              send: jest.fn().mockResolvedValue(undefined),
            }),
          },
        ],
      }).compile();

      controller = module.get<AuthController>(AuthController);
      service = module.get<UserService>(UserService);
      strategy = module.get<MagicLoginStrategy>(MagicLoginStrategy);
    });
    it('should create a user and send a link', async () => {
      const magicLoginRegisterDto: MagicLoginRegisterDto = {
        destination: testEmail1,
        firstName: testFirstName1,
        lastName: testLastName1,
      };
      const createUserDto: CreateUserDto = {
        email: testEmail1,
        firstName: testFirstName1,
        lastName: testLastName1,
      };
      await expect(
        controller.checkAndRegister(magicLoginRegisterDto, req, res)
      ).resolves.toBeUndefined();
      expect(service.findOneByEmail).toBeCalledTimes(1);
      expect(service.findOneByEmail).toBeCalledWith(testEmail1);
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(createUserDto);
    });
  });
});
