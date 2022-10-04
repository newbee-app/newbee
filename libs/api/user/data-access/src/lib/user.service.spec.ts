import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { testUserEntity1, UserEntity } from '@newbee/api/shared/data-access';
import {
  testCreateUserDto1,
  testUpdateUserDto1,
} from '@newbee/shared/data-access';
import { testUser1 } from '@newbee/shared/util';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let dataSource: DataSource;

  describe('standard testUserEntity1', () => {
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
              createQueryRunner: () =>
                createMock<QueryRunner>({
                  manager: createMock<EntityManager>({
                    save: jest.fn().mockResolvedValue(testUserEntity1),
                  }),
                }),
            }),
          },
        ],
      }).compile();

      service = module.get<UserService>(UserService);
      repository = module.get<Repository<UserEntity>>(
        getRepositoryToken(UserEntity)
      );
      dataSource = module.get<DataSource>(getDataSourceToken());
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
      expect(dataSource).toBeDefined();
    });

    describe('create()', () => {
      it('should successfully insert a user', async () => {
        await expect(service.create(testCreateUserDto1)).resolves.toEqual(
          testUserEntity1
        );
        expect(dataSource.createQueryRunner).toBeDefined();
        expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);
      });
    });

    describe('findOneById()', () => {
      it('should get a single user by id', async () => {
        await expect(service.findOneById(testUser1.id)).resolves.toEqual(
          testUserEntity1
        );
        expect(repository.findOne).toBeCalledTimes(1);
        expect(repository.findOne).toBeCalledWith({
          where: { id: testUser1.id },
        });
      });
    });

    describe('findOneByEmail()', () => {
      it('should get a single user by email', async () => {
        await expect(service.findOneByEmail(testUser1.email)).resolves.toEqual(
          testUserEntity1
        );
        expect(repository.findOne).toBeCalledTimes(1);
        expect(repository.findOne).toBeCalledWith({
          where: { email: testUser1.email },
        });
      });
    });

    describe('delete()', () => {
      it('should call delete with the passed id', async () => {
        await expect(service.delete(testUser1.id)).resolves.toBeTruthy();
        expect(repository.findOne).toBeCalledTimes(1);
        expect(repository.findOne).toBeCalledWith({
          where: { id: testUser1.id },
        });
        expect(repository.remove).toBeCalledTimes(1);
        expect(repository.remove).toBeCalledWith(testUserEntity1);
      });
    });
  });

  describe('updated testUserEntity1', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: getRepositoryToken(UserEntity),
            useValue: createMock<Repository<UserEntity>>({
              findOne: jest.fn().mockResolvedValue(testUserEntity1),
              save: jest.fn().mockResolvedValue({
                ...testUserEntity1,
                ...testUpdateUserDto1,
              }),
            }),
          },
          {
            provide: getDataSourceToken(),
            useValue: createMock<DataSource>({}),
          },
        ],
      }).compile();

      service = module.get<UserService>(UserService);
      repository = module.get<Repository<UserEntity>>(
        getRepositoryToken(UserEntity)
      );
      dataSource = module.get<DataSource>(getDataSourceToken());
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
      expect(dataSource).toBeDefined();
    });

    describe('update()', () => {
      it('should try to find and update a user by id', async () => {
        await expect(
          service.update(testUser1.id, testUpdateUserDto1)
        ).resolves.toEqual({ ...testUserEntity1, ...testUpdateUserDto1 });
        expect(repository.findOne).toBeCalledTimes(1);
        expect(repository.findOne).toBeCalledWith({
          where: { id: testUser1.id },
        });
        expect(repository.save).toBeCalledTimes(1);
        expect(repository.save).toBeCalledWith({
          ...testUpdateUserDto1,
          id: testUser1.id,
        });
      });
    });
  });
});
