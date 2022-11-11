import { createMock } from '@golevelup/ts-jest';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { testUserEntity1 } from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { testUpdateUserDto1 } from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
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
      expect(service.findOneById).toBeCalledWith(testUser1.id);
    });

    it('should get a single user by id', async () => {
      await expect(controller.findOneById(testUser1.id)).resolves.toEqual(
        testUserEntity1
      );
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
      await expect(controller.findOneById(testUser1.id)).rejects.toThrow(
        new NotFoundException(idNotFoundErrorMsg('a', 'user', testUser1.id))
      );
    });

    it('should throw an InternalServerErrorException if service throws an error', async () => {
      jest
        .spyOn(service, 'findOneById')
        .mockRejectedValue(
          new InternalServerErrorException(internalServerErrorMsg)
        );
      await expect(controller.findOneById(testUser1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('update()', () => {
    afterEach(() => {
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(testUser1.id, testUpdateUserDto1);
    });

    it('should find and update a user by id', async () => {
      await expect(
        controller.update(testUser1.id, testUpdateUserDto1)
      ).resolves.toEqual({ ...testUserEntity1, ...testUpdateUserDto1 });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new NotFoundException(idNotFoundErrorMsg('a', 'user', testUser1.id))
        );
      await expect(
        controller.update(testUser1.id, testUpdateUserDto1)
      ).rejects.toThrow(
        new NotFoundException(idNotFoundErrorMsg('a', 'user', testUser1.id))
      );
    });

    it('should throw an InternalServerErrorException if service throws an error', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new InternalServerErrorException(internalServerErrorMsg)
        );
      await expect(
        controller.update(testUser1.id, testUpdateUserDto1)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('delete()', () => {
    afterEach(() => {
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(testUser1.id);
    });

    it('should find and delete a user by id', async () => {
      await expect(controller.delete(testUser1.id)).resolves.toBeUndefined();
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(
          new NotFoundException(idNotFoundErrorMsg('a', 'user', testUser1.id))
        );
      await expect(controller.delete(testUser1.id)).rejects.toThrow(
        new NotFoundException(idNotFoundErrorMsg('a', 'user', testUser1.id))
      );
    });

    it('should throw an InternalServerErrorException if service throws an error', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(
          new InternalServerErrorException(internalServerErrorMsg)
        );
      await expect(controller.delete(testUser1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });
});
