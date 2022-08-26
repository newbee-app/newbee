import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { UserEntity } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { UpdateUserDto } from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { UserController } from './user.controller';

const { fullName, ...rest } = testUser1;
fullName; // to shut up the unused var warning
const testUserEntity1 = new UserEntity(rest);

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
            update: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOneById()', () => {
    it('should get a single user by id', async () => {
      await expect(controller.findOneById(testUser1.id)).resolves.toEqual(
        testUserEntity1
      );
      expect(service.findOneById).toBeCalledTimes(1);
      expect(service.findOneById).toBeCalledWith(testUser1.id);
    });
  });

  describe('update()', () => {
    it('should try to find and update a user by id', async () => {
      const updateUserDto: UpdateUserDto = {
        email: testUser1.email,
        firstName: testUser1.firstName,
        lastName: testUser1.lastName,
      };
      await expect(
        controller.update(testUser1.id, updateUserDto)
      ).resolves.toEqual(testUserEntity1);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(testUser1.id, updateUserDto);
    });
  });

  describe('delete()', () => {
    it('should try to find and delete a user by id', async () => {
      await expect(controller.delete(testUser1.id)).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testUser1.id);
    });
  });
});
