import { createMock } from '@golevelup/ts-jest';
import { EntityRepository, NotFoundError } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  testUserSettingsEntity1,
  UserSettingsEntity,
} from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;
  let repository: EntityRepository<UserSettingsEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSettingsService,
        {
          provide: getRepositoryToken(UserSettingsEntity),
          useValue: createMock<EntityRepository<UserSettingsEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testUserSettingsEntity1),
          }),
        },
      ],
    }).compile();

    service = module.get<UserSettingsService>(UserSettingsService);
    repository = module.get<EntityRepository<UserSettingsEntity>>(
      getRepositoryToken(UserSettingsEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith(
        testUserSettingsEntity1.id
      );
    });

    it(`should get a single user's settings by id`, async () => {
      await expect(
        service.findOneById(testUserSettingsEntity1.id)
      ).resolves.toEqual(testUserSettingsEntity1);
    });

    it('should throw a NotFoundException if a NotFoundError is encountered', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneById(testUserSettingsEntity1.id)
      ).rejects.toThrow(
        new NotFoundException(
          idNotFoundErrorMsg(
            'a',
            'user settings',
            'an',
            'ID',
            testUserSettingsEntity1.id
          )
        )
      );
    });

    it('should throw an InternalServerErrorException if an error is encountered', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneById(testUserSettingsEntity1.id)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });
});
