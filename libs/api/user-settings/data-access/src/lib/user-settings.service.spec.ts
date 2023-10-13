import { createMock } from '@golevelup/ts-jest';
import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  UserSettingsEntity,
  testUserSettingsEntity1,
} from '@newbee/api/shared/data-access';
import {
  internalServerError,
  userSettingsIdNotFound,
} from '@newbee/shared/util';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;
  let em: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserSettingsService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOneOrFail: jest.fn().mockResolvedValue(testUserSettingsEntity1),
          }),
        },
      ],
    }).compile();

    service = module.get<UserSettingsService>(UserSettingsService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toBeCalledTimes(1);
      expect(em.findOneOrFail).toBeCalledWith(
        UserSettingsEntity,
        testUserSettingsEntity1.user.id,
      );
    });

    it(`should get a single user's settings by id`, async () => {
      await expect(
        service.findOneById(testUserSettingsEntity1.user.id),
      ).resolves.toEqual(testUserSettingsEntity1);
    });

    it('should throw a NotFoundException if a NotFoundError is encountered', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneById(testUserSettingsEntity1.user.id),
      ).rejects.toThrow(new NotFoundException(userSettingsIdNotFound));
    });

    it('should throw an InternalServerErrorException if an error is encountered', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneById(testUserSettingsEntity1.user.id),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });
});
