import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { User } from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { UpdateUserDto } from '@newbee/api/user/util';
import { UserController } from './user.controller';

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
            create: jest.fn().mockResolvedValue(oneUser),
            findOneById: jest.fn().mockResolvedValue(oneUser),
            update: jest.fn().mockResolvedValue(oneUser),
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
      await expect(controller.findOneById(testId1)).resolves.toEqual(oneUser);
      expect(service.findOneById).toBeCalledTimes(1);
      expect(service.findOneById).toBeCalledWith(testId1);
    });
  });

  describe('update()', () => {
    it('should try to find and update a user by id', async () => {
      const updateUserDto: UpdateUserDto = {
        email: testEmail1,
        firstName: testFirstName1,
        lastName: testLastName1,
      };
      await expect(controller.update(testId1, updateUserDto)).resolves.toEqual(
        oneUser
      );
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(testId1, updateUserDto);
    });
  });

  describe('delete()', () => {
    it('should try to find and delete a user by id', async () => {
      await expect(controller.delete(testId1)).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testId1);
    });
  });
});
