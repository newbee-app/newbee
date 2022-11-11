import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import {
  testAuthenticatorEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  internalServerErrorMsg,
  testUserJwtPayload1,
} from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { testRegistrationCredential1 } from '@newbee/shared/util';
import { AuthenticatorController } from './authenticator.controller';

describe('AuthenticatorController', () => {
  let controller: AuthenticatorController;
  let service: AuthenticatorService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticatorController],
      providers: [
        {
          provide: AuthenticatorService,
          useValue: createMock<AuthenticatorService>({
            create: jest.fn().mockResolvedValue(testAuthenticatorEntity1),
          }),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>({
            findOneById: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthenticatorController>(AuthenticatorController);
    service = module.get<AuthenticatorService>(AuthenticatorService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(userService.findOneById).toBeCalledTimes(1);
      expect(userService.findOneById).toBeCalledWith(testUserJwtPayload1.sub);
    });

    it('should create an authenticator', async () => {
      await expect(
        controller.create(testRegistrationCredential1, testUserJwtPayload1)
      ).resolves.toEqual(testAuthenticatorEntity1);
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(
        testRegistrationCredential1,
        testUserEntity1
      );
    });

    it('should throw an InternalServerErrorException if user does not exist', async () => {
      jest.spyOn(userService, 'findOneById').mockResolvedValue(null);
      await expect(
        controller.create(testRegistrationCredential1, testUserJwtPayload1)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });
});
