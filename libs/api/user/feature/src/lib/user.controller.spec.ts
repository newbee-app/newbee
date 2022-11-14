import { createMock } from '@golevelup/ts-jest';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  internalServerErrorMsg,
  unauthorizedErrorMsg,
} from '@newbee/api/shared/util';
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

  describe('findOneById()', () => {
    afterEach(() => {
      expect(service.findOneById).toBeCalledTimes(1);
      expect(service.findOneById).toBeCalledWith(testUserEntity1.id);
    });

    it('should get a single user by id', async () => {
      await expect(controller.findOneById(testUserEntity1.id)).resolves.toEqual(
        testUserEntity1
      );
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
      await expect(controller.findOneById(testUserEntity1.id)).rejects.toThrow(
        new NotFoundException(
          idNotFoundErrorMsg('a', 'user', testUserEntity1.id)
        )
      );
    });

    it('should throw an InternalServerErrorException if service throws an error', async () => {
      jest
        .spyOn(service, 'findOneById')
        .mockRejectedValue(
          new InternalServerErrorException(internalServerErrorMsg)
        );
      await expect(controller.findOneById(testUserEntity1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('update()', () => {
    it('should find and update a user by id', async () => {
      await expect(
        controller.update(
          testUserEntity1.id,
          testUpdateUserDto1,
          testUserEntity1
        )
      ).resolves.toEqual({ ...testUserEntity1, ...testUpdateUserDto1 });
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(
        testUserEntity1.id,
        testUpdateUserDto1
      );
    });

    it('should throw an UnauthorizedException if user IDs do not match', async () => {
      await expect(
        controller.update('junk', testUpdateUserDto1, testUserEntity1)
      ).rejects.toThrow(new UnauthorizedException(unauthorizedErrorMsg));
    });
  });

  describe('delete()', () => {
    it('should find and delete a user by id', async () => {
      await expect(
        controller.delete(testUserEntity1.id, testUserEntity1)
      ).resolves.toBeUndefined();
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testUserEntity1.id);
    });

    it('should throw an UnauthorizedException if user IDs do not match', async () => {
      await expect(controller.delete('junk', testUserEntity1)).rejects.toThrow(
        new UnauthorizedException(unauthorizedErrorMsg)
      );
    });
  });
});
