import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  testUserEntity1,
  testUserSettingsEntity1,
  UserSettingsEntity,
} from '@newbee/api/shared/data-access';
import { UserService } from '@newbee/api/user/data-access';
import { testUpdateUserSettingsDto1 } from '@newbee/shared/data-access';
import { testUserSettings1 } from '@newbee/shared/util';
import { Repository } from 'typeorm';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;
  let repository: Repository<UserSettingsEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSettingsService,
        {
          provide: UserService,
          useValue: createMock<UserService>({
            findOneById: jest.fn().mockResolvedValue(testUserEntity1),
          }),
        },
        {
          provide: getRepositoryToken(UserSettingsEntity),
          useValue: createMock<Repository<UserSettingsEntity>>({
            findOne: jest.fn().mockResolvedValue(testUserSettingsEntity1),
            save: jest.fn().mockResolvedValue(testUserSettingsEntity1),
          }),
        },
      ],
    }).compile();

    service = module.get<UserSettingsService>(UserSettingsService);
    repository = module.get<Repository<UserSettingsEntity>>(
      getRepositoryToken(UserSettingsEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById()', () => {
    it(`should get a single user's settings by id`, async () => {
      await expect(service.findOneById(testUserSettings1.id)).resolves.toEqual(
        testUserSettingsEntity1
      );
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { id: testUserSettings1.id },
      });
    });
  });

  describe('update()', () => {
    it(`should try to find and update a user's settings by id`, async () => {
      await expect(
        service.update(testUserSettings1.id, testUpdateUserSettingsDto1)
      ).resolves.toEqual(testUserSettingsEntity1);
      expect(repository.findOne).toBeCalledTimes(0);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith({
        ...testUpdateUserSettingsDto1,
        user: testUserEntity1,
      });
    });
  });
});
