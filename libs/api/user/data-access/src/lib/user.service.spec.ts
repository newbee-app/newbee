import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@newbee/api/shared/data-access';
import { CreateUserDto, UpdateUserDto } from '@newbee/api/user/util';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { UserService } from './user.service';

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

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>({
            findOne: jest.fn().mockResolvedValue(oneUser),
            save: jest.fn().mockResolvedValue(oneUser),
          }),
        },
        {
          provide: getDataSourceToken(),
          useValue: createMock<DataSource>({
            createQueryRunner: () =>
              createMock<QueryRunner>({
                manager: createMock<EntityManager>({
                  save: jest.fn().mockResolvedValue(oneUser),
                }),
              }),
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    dataSource = module.get<DataSource>(getDataSourceToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a user', async () => {
      const createUserDto: CreateUserDto = {
        email: testEmail1,
        firstName: testFirstName1,
        lastName: testLastName1,
      };
      await expect(service.create(createUserDto)).resolves.toEqual(oneUser);
      expect(dataSource.createQueryRunner).toBeDefined();
      expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById()', () => {
    it('should get a single user by id', async () => {
      await expect(service.findOneById(testId1)).resolves.toEqual(oneUser);
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({ where: { id: testId1 } });
    });
  });

  describe('findOneByEmail()', () => {
    it('should get a single user by email', async () => {
      await expect(service.findOneByEmail(testEmail1)).resolves.toEqual(
        oneUser
      );
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { email: testEmail1 },
      });
    });
  });

  describe('update()', () => {
    it('should try to find and update a user by id', async () => {
      const updateUserDto: UpdateUserDto = {
        email: testEmail1,
        firstName: testFirstName1,
        lastName: testLastName1,
      };
      await expect(service.update(testId1, updateUserDto)).resolves.toEqual(
        oneUser
      );
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({ where: { id: testId1 } });
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith({ ...updateUserDto, id: testId1 });
    });
  });

  describe('delete()', () => {
    it('should call delete with the passed id', async () => {
      await expect(service.delete(testId1)).resolves.toBeTruthy();
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({ where: { id: testId1 } });
      expect(repository.remove).toBeCalledTimes(1);
      expect(repository.remove).toBeCalledWith(oneUser);
    });
  });
});
