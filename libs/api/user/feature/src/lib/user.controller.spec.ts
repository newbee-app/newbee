import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { elongateUuid } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import {
  internalServerError,
  testTokenDto1,
  testUpdateUserDto1,
} from '@newbee/shared/util';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: createMock<UserService>({
            update: jest.fn().mockResolvedValue(testUserEntity1),
            sendVerificationEmail: jest
              .fn()
              .mockResolvedValue([testUserEntity1]),
            findOneById: jest.fn().mockResolvedValue(testUserEntity1),
            verifyEmail: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should find and update a user', async () => {
      await expect(
        controller.update(testUpdateUserDto1, testUserEntity1),
      ).resolves.toEqual(testUserEntity1);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        testUserEntity1,
        testUpdateUserDto1,
      );
    });
  });

  describe('delete', () => {
    it('should find and delete a user', async () => {
      await expect(controller.delete(testUserEntity1)).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(testUserEntity1);
    });
  });

  describe('sendVerificationEmail', () => {
    afterEach(() => {
      expect(service.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(service.sendVerificationEmail).toHaveBeenCalledWith(
        testUserEntity1,
      );
    });

    it('should send a verification email', async () => {
      await expect(
        controller.sendVerificationEmail(testUserEntity1),
      ).resolves.toEqual(testUserEntity1);
    });

    it('should throw an InternalServerErrorException if email cannot be sent', async () => {
      jest.spyOn(service, 'sendVerificationEmail').mockResolvedValue([]);
      await expect(
        controller.sendVerificationEmail(testUserEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('verifyEmail', () => {
    it(`should verify the user's email`, async () => {
      await expect(controller.verifyEmail(testTokenDto1)).resolves.toEqual(
        testUserEntity1,
      );
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(service.findOneById).toHaveBeenCalledWith(
        elongateUuid(testTokenDto1.token),
      );
      expect(service.verifyEmail).toHaveBeenCalledTimes(1);
      expect(service.verifyEmail).toHaveBeenCalledWith(testUserEntity1);
    });
  });
});
