import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  testUserSettingsEntity1,
  UserSettingsEntity,
} from '@newbee/api/shared/data-access';
import { internalServerErrorMsg } from '@newbee/api/shared/util';
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
          provide: getRepositoryToken(UserSettingsEntity),
          useValue: createMock<Repository<UserSettingsEntity>>({
            findOne: jest.fn().mockResolvedValue(testUserSettingsEntity1),
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
    expect(repository).toBeDefined();
  });

  describe('findOneById', () => {
    it(`should get a single user's settings by id`, async () => {
      await expect(
        service.findOneById(testUserSettings1.userId)
      ).resolves.toEqual(testUserSettingsEntity1);
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { userId: testUserSettings1.userId },
      });
    });

    it('should throw an error if an error is encountered', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneById(testUserSettings1.userId)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { userId: testUserSettings1.userId },
      });
    });
  });
});
