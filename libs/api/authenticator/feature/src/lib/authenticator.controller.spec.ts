import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import {
  testAuthenticatorEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { testBaseRegistrationResponseDto1 } from '@newbee/shared/data-access';
import {
  testPublicKeyCredentialCreationOptions1,
  testRegistrationResponse1,
} from '@newbee/shared/util';
import { AuthenticatorController } from './authenticator.controller';

describe('AuthenticatorController', () => {
  let controller: AuthenticatorController;
  let service: AuthenticatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticatorController],
      providers: [
        {
          provide: AuthenticatorService,
          useValue: createMock<AuthenticatorService>({
            generateOptions: jest
              .fn()
              .mockResolvedValue(testPublicKeyCredentialCreationOptions1),
            create: jest.fn().mockResolvedValue(testAuthenticatorEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthenticatorController>(AuthenticatorController);
    service = module.get<AuthenticatorService>(AuthenticatorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('createOptions', () => {
    it('should create registration options', async () => {
      await expect(controller.createOptions(testUserEntity1)).resolves.toEqual(
        testPublicKeyCredentialCreationOptions1
      );
      expect(service.generateOptions).toBeCalledTimes(1);
      expect(service.generateOptions).toBeCalledWith(testUserEntity1);
    });
  });

  describe('createPost', () => {
    it('should create an authenticator', async () => {
      await expect(
        controller.create(testBaseRegistrationResponseDto1, testUserEntity1)
      ).resolves.toEqual(testAuthenticatorEntity1);
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith(
        testRegistrationResponse1,
        testUserEntity1
      );
    });
  });
});
