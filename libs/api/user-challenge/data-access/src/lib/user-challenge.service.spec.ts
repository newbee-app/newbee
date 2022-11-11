import { createMock } from '@golevelup/ts-jest';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserChallengeEntity } from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
import { testUserChallenge1 } from '@newbee/shared/util';
import { Repository } from 'typeorm';
import { UserChallengeService } from './user-challenge.service';

const testChallenge2 = 'challenge2';

describe('UserChallengeService', () => {
  let service: UserChallengeService;
  let repository: Repository<UserChallengeEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserChallengeService,
        {
          provide: getRepositoryToken(UserChallengeEntity),
          useValue: createMock<Repository<UserChallengeEntity>>({
            findOne: jest.fn().mockResolvedValue(testUserChallenge1),
            save: jest.fn().mockResolvedValue({
              ...testUserChallenge1,
              challenge: testChallenge2,
            }),
          }),
        },
      ],
    }).compile();

    service = module.get<UserChallengeService>(UserChallengeService);
    repository = module.get<Repository<UserChallengeEntity>>(
      getRepositoryToken(UserChallengeEntity)
    );
  });

  afterEach(() => {
    expect(repository.findOne).toBeCalledTimes(1);
    expect(repository.findOne).toBeCalledWith({
      where: { userId: testUserChallenge1.userId },
    });
  });

  describe('findOneById', () => {
    it('should get a single user challenge by user id', async () => {
      await expect(
        service.findOneById(testUserChallenge1.userId)
      ).resolves.toEqual(testUserChallenge1);
    });

    it('should throw an error if an error is encountered', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneById(testUserChallenge1.userId)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('update', () => {
    it('should find and update a user challenge by user id', async () => {
      await expect(
        service.update(testUserChallenge1.userId, testChallenge2)
      ).resolves.toEqual({ ...testUserChallenge1, challenge: testChallenge2 });
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith({
        ...testUserChallenge1,
        challenge: testChallenge2,
      });
    });

    it('should throw a NotFoundException if user challenge does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(
        service.update(testUserChallenge1.userId, testChallenge2)
      ).rejects.toThrow(
        new NotFoundException(
          idNotFoundErrorMsg('a', 'user challenge', testUserChallenge1.userId)
        )
      );
      expect(repository.save).not.toBeCalled();
    });

    it('should throw an error if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.update(testUserChallenge1.userId, testChallenge2)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.save).not.toBeCalled();
    });

    it('should throw an error if save throws an error', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('save'));
      await expect(
        service.update(testUserChallenge1.userId, testChallenge2)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(
        new UserChallengeEntity({
          ...testUserChallenge1,
          challenge: testChallenge2,
        })
      );
    });
  });
});
