import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { testUpdateUserDto1 } from '@newbee/shared/data-access';
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
            create: jest.fn().mockResolvedValue(testUserEntity1),
            findOneById: jest.fn().mockResolvedValue(testUserEntity1),
            update: jest
              .fn()
              .mockResolvedValue({ ...testUserEntity1, ...testUpdateUserDto1 }),
            delete: jest.fn().mockResolvedValue(true),
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
        controller.update(testUpdateUserDto1, testUserEntity1)
      ).resolves.toEqual({ ...testUserEntity1, ...testUpdateUserDto1 });
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        testUserEntity1,
        testUpdateUserDto1
      );
    });
  });

  describe('delete', () => {
    it('should find and delete a user', async () => {
      await expect(controller.delete(testUserEntity1)).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testUserEntity1);
    });
  });
});
