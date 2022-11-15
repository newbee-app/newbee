import { createMock } from '@golevelup/ts-jest';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { testUserEntity1, UserEntity } from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
import { testUserAndOptions1 } from '@newbee/api/user/util';
import {
  testCreateUserDto1,
  testUpdateUserDto1,
} from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { UserService } from './user.service';

jest.mock('@simplewebauthn/server', () => ({
  __esModule: true,
  generateRegistrationOptions: jest.fn(),
}));
const mockGenerateRegistrationOptions =
  generateRegistrationOptions as jest.Mock;

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMock<Repository<UserEntity>>({
            findOne: jest.fn().mockResolvedValue(testUserEntity1),
            save: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
        {
          provide: getDataSourceToken(),
          useValue: createMock<DataSource>({
            createQueryRunner: jest.fn().mockReturnValue(
              createMock<QueryRunner>({
                manager: createMock<EntityManager>({
                  save: jest.fn().mockResolvedValue(testUserEntity1),
                }),
              })
            ),
          }),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
    dataSource = module.get<DataSource>(getDataSourceToken());

    mockGenerateRegistrationOptions.mockReturnValue(
      testUserAndOptions1.options
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { email: testUser1.email },
      });
    });

    it('should throw a BadRequestException if email already exists', async () => {
      await expect(service.create(testCreateUserDto1)).rejects.toThrow(
        new BadRequestException(
          `The email ${testCreateUserDto1.email} is already taken, please use a different email or log in to your existing account!`
        )
      );
      expect(dataSource.createQueryRunner).not.toBeCalled();
    });

    describe('user email does not already exist', () => {
      beforeEach(() => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      });

      it('should create a user', async () => {
        await expect(service.create(testCreateUserDto1)).resolves.toEqual(
          testUserAndOptions1
        );
        expect(dataSource.createQueryRunner).toBeCalledTimes(1);
      });

      it('should throw an error if querryRunner throws an error', async () => {
        jest
          .spyOn(dataSource.createQueryRunner().manager, 'save')
          .mockRejectedValue(new Error('save'));
        await expect(service.create(testCreateUserDto1)).rejects.toThrow(
          new InternalServerErrorException(internalServerErrorMsg)
        );
        // Once in spy setup, once in the actual implementation
        expect(dataSource.createQueryRunner).toBeCalledTimes(2);
      });
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { id: testUser1.id },
      });
    });

    it('should get a single user by id', async () => {
      await expect(service.findOneById(testUser1.id)).resolves.toEqual(
        testUserEntity1
      );
    });

    it('should throw an error if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(service.findOneById(testUser1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('findOneByEmail', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { email: testUser1.email },
      });
    });

    it('should get a single user by email', async () => {
      await expect(service.findOneByEmail(testUser1.email)).resolves.toEqual(
        testUserEntity1
      );
    });

    it('should throw an error if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(service.findOneByEmail(testUser1.email)).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('update', () => {
    const testUpdatedUser1 = { ...testUserEntity1, ...testUpdateUserDto1 };

    beforeEach(() => {
      jest.spyOn(repository, 'save').mockResolvedValue(testUpdatedUser1);
    });

    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { id: testUser1.id },
      });
    });

    it('should find and update the user by id', async () => {
      await expect(
        service.update(testUser1.id, testUpdateUserDto1)
      ).resolves.toEqual(testUpdatedUser1);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith({
        ...testUserEntity1,
        ...testUpdateUserDto1,
      });
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(
        service.update(testUser1.id, testUpdateUserDto1)
      ).rejects.toThrow(
        new NotFoundException(
          idNotFoundErrorMsg('a', 'user', 'an', 'ID', testUser1.id)
        )
      );
      expect(repository.save).not.toBeCalled();
    });

    it('should throw an error if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.update(testUser1.id, testUpdateUserDto1)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.save).not.toBeCalled();
    });

    it('should throw an error if save throws an error', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('save'));
      await expect(
        service.update(testUser1.id, testUpdateUserDto1)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith({
        ...testUserEntity1,
        ...testUpdateUserDto1,
      });
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { id: testUser1.id },
      });
    });

    it('should delete the user if user exists', async () => {
      await expect(service.delete(testUser1.id)).resolves.toBeUndefined();
      expect(repository.remove).toBeCalledTimes(1);
      expect(repository.remove).toBeCalledWith(testUserEntity1);
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.delete(testUser1.id)).rejects.toThrow(
        new NotFoundException(
          idNotFoundErrorMsg('a', 'user', 'an', 'ID', testUser1.id)
        )
      );
      expect(repository.remove).not.toBeCalled();
    });

    it('should throw an error if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(service.delete(testUser1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.remove).not.toBeCalled();
    });

    it('should throw an error if remove throws an error', async () => {
      jest.spyOn(repository, 'remove').mockRejectedValue(new Error('remove'));
      await expect(service.delete(testUser1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.remove).toBeCalledTimes(1);
      expect(repository.remove).toBeCalledWith(testUserEntity1);
    });
  });
});
