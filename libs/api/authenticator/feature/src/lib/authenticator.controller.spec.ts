import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import {
  testAuthenticatorEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseNameDto1,
  testBaseRegistrationResponseDto1,
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
            findAllByUser: jest
              .fn()
              .mockResolvedValue([testAuthenticatorEntity1]),
            updateNameById: jest
              .fn()
              .mockResolvedValue(testAuthenticatorEntity1),
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

  describe('getAll', () => {
    it('should get all authenticators', async () => {
      await expect(controller.getAll(testUserEntity1)).resolves.toEqual([
        testAuthenticatorEntity1,
      ]);
      expect(service.findAllByUser).toHaveBeenCalledTimes(1);
      expect(service.findAllByUser).toHaveBeenCalledWith(testUserEntity1);
    });
  });

  describe('createOptions', () => {
    it('should create registration options', async () => {
      await expect(controller.createOptions(testUserEntity1)).resolves.toEqual(
        testPublicKeyCredentialCreationOptions1,
      );
      expect(service.generateOptions).toHaveBeenCalledTimes(1);
      expect(service.generateOptions).toHaveBeenCalledWith(testUserEntity1);
    });
  });

  describe('createPost', () => {
    it('should create an authenticator', async () => {
      await expect(
        controller.create(testBaseRegistrationResponseDto1, testUserEntity1),
      ).resolves.toEqual(testAuthenticatorEntity1);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(
        testRegistrationResponse1,
        testUserEntity1,
      );
    });
  });

  describe('updateName', () => {
    it(`should update an authenticator's name`, async () => {
      await expect(
        controller.updateName(
          testAuthenticatorEntity1.id,
          testBaseNameDto1,
          testUserEntity1,
        ),
      ).resolves.toEqual(testAuthenticatorEntity1);
      expect(service.updateNameById).toHaveBeenCalledTimes(1);
      expect(service.updateNameById).toHaveBeenCalledWith(
        testAuthenticatorEntity1.id,
        testBaseNameDto1.name,
        testUserEntity1.id,
      );
    });
  });

  describe('delete', () => {
    it('should delete an authenticator', async () => {
      await expect(
        controller.delete(testAuthenticatorEntity1.id, testUserEntity1),
      ).resolves.toBeUndefined();
      expect(service.deleteOneById).toHaveBeenCalledTimes(1);
      expect(service.deleteOneById).toHaveBeenCalledWith(
        testAuthenticatorEntity1.id,
        testUserEntity1.id,
      );
    });
  });
});
