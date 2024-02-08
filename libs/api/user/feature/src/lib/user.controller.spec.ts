import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { elongateUuid } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { testBaseTokenDto1, testUpdateUserDto1 } from '@newbee/shared/util';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const testUpdatedUserEntity = {
    ...testUserEntity1,
    ...testUpdateUserDto1,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: createMock<UserService>({
            create: jest.fn().mockResolvedValue(testUserEntity1),
            findOneById: jest.fn().mockResolvedValue(testUserEntity1),
            update: jest.fn().mockResolvedValue(testUpdatedUserEntity),
            verifyEmail: jest.fn().mockResolvedValue(testUpdatedUserEntity),
          }),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('update', () => {
    it('should find and update a user', async () => {
      await expect(
        controller.update(testUpdateUserDto1, testUserEntity1),
      ).resolves.toEqual(testUpdatedUserEntity);
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
    it('should send a verification email', async () => {
      await expect(
        controller.sendVerificationEmail(testUserEntity1),
      ).resolves.toBeUndefined();
      expect(service.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(service.sendVerificationEmail).toHaveBeenCalledWith(
        testUserEntity1,
      );
    });
  });

  describe('verifyEmail', () => {
    it(`should verify the user's email`, async () => {
      await expect(controller.verifyEmail(testBaseTokenDto1)).resolves.toEqual(
        testUpdatedUserEntity,
      );
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(service.findOneById).toHaveBeenCalledWith(
        elongateUuid(testBaseTokenDto1.token),
      );
      expect(service.verifyEmail).toHaveBeenCalledTimes(1);
      expect(service.verifyEmail).toHaveBeenCalledWith(testUserEntity1);
    });
  });
});
