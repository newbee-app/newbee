import { createMock } from '@golevelup/ts-jest';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { testUserEntity1, UserEntity } from '@newbee/api/shared/data-access';
import { internalServerErrorMsg } from '@newbee/api/shared/util';
import { testUserAndOptions1 } from '@newbee/api/user/util';
import {
  testCreateUserDto1,
  testUpdateUserDto1,
} from '@newbee/shared/data-access';
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

    jest.clearAllMocks();
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
        where: { email: testUserEntity1.email },
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

      it('should throw an InternalServerErrorException if querryRunner throws an error', async () => {
        jest
          .spyOn(dataSource.createQueryRunner().manager, 'save')
          .mockRejectedValue(new Error('save'));
        await expect(service.create(testCreateUserDto1)).rejects.toThrow(
          new InternalServerErrorException(internalServerErrorMsg)
        );
      });
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { id: testUserEntity1.id },
      });
    });

    it('should get a single user by id', async () => {
      await expect(service.findOneById(testUserEntity1.id)).resolves.toEqual(
        testUserEntity1
      );
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(service.findOneById(testUserEntity1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('findOneByEmail', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { email: testUserEntity1.email },
      });
    });

    it('should get a single user by email', async () => {
      await expect(
        service.findOneByEmail(testUserEntity1.email)
      ).resolves.toEqual(testUserEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneByEmail(testUserEntity1.email)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('update', () => {
    const testUpdatedUser = { ...testUserEntity1, ...testUpdateUserDto1 };

    beforeEach(() => {
      jest.spyOn(repository, 'save').mockResolvedValue(testUpdatedUser);
    });

    afterEach(() => {
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith({
        ...testUserEntity1,
        ...testUpdateUserDto1,
      });
    });

    it('should update the user', async () => {
      await expect(
        service.update(testUserEntity1, testUpdateUserDto1)
      ).resolves.toEqual(testUpdatedUser);
    });

    it('should throw an error if save throws an error', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('save'));
      await expect(
        service.update(testUserEntity1, testUpdateUserDto1)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(repository.remove).toBeCalledTimes(1);
      expect(repository.remove).toBeCalledWith(testUserEntity1);
    });

    it('should delete the user', async () => {
      await expect(service.delete(testUserEntity1)).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if remove throws an error', async () => {
      jest.spyOn(repository, 'remove').mockRejectedValue(new Error('remove'));
      await expect(service.delete(testUserEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });
});
