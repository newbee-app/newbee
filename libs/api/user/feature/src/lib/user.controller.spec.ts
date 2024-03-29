import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { testBaseUpdateUserDto1 } from '@newbee/shared/util';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const testUpdatedUserEntity = {
    ...testUserEntity1,
    ...testBaseUpdateUserDto1,
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
        controller.update(testBaseUpdateUserDto1, testUserEntity1),
      ).resolves.toEqual(testUpdatedUserEntity);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        testUserEntity1,
        testBaseUpdateUserDto1,
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
});
