import { createMock } from '@golevelup/ts-jest';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  testUserChallengeEntity1,
  testUserEntity1,
  UserChallengeEntity,
} from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
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
            findOne: jest.fn().mockResolvedValue(testUserChallengeEntity1),
            save: jest.fn().mockResolvedValue({
              ...testUserChallengeEntity1,
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

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { userId: testUserChallengeEntity1.userId },
      });
    });

    it('should get a single user challenge by user id', async () => {
      await expect(
        service.findOneById(testUserChallengeEntity1.userId)
      ).resolves.toEqual(testUserChallengeEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneById(testUserChallengeEntity1.userId)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
    });
  });

  describe('findOneByEmail', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { user: { email: testUserEntity1.email } },
      });
    });

    it('should get a single user challenge by user email', async () => {
      await expect(
        service.findOneByEmail(testUserEntity1.email)
      ).resolves.toEqual(testUserChallengeEntity1);
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

  describe('updateByEmail', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        where: { user: { email: testUserEntity1.email } },
      });
    });

    it('should find and update a user challenge by user id', async () => {
      await expect(
        service.updateByEmail(testUserEntity1.email, testChallenge2)
      ).resolves.toEqual({
        ...testUserChallengeEntity1,
        challenge: testChallenge2,
      });
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith({
        ...testUserChallengeEntity1,
        challenge: testChallenge2,
      });
    });

    it('should throw a NotFoundException if user challenge does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(
        service.updateByEmail(testUserEntity1.email, testChallenge2)
      ).rejects.toThrow(
        new NotFoundException(
          idNotFoundErrorMsg(
            'a',
            'user challenge',
            'an',
            'email',
            testUserEntity1.email
          )
        )
      );
      expect(repository.save).not.toBeCalled();
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.updateByEmail(testUserEntity1.email, testChallenge2)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.save).not.toBeCalled();
    });

    it('should throw an InternalServerErrorException if save throws an error', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('save'));
      await expect(
        service.updateByEmail(testUserEntity1.email, testChallenge2)
      ).rejects.toThrow(
        new InternalServerErrorException(internalServerErrorMsg)
      );
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(
        new UserChallengeEntity({
          ...testUserChallengeEntity1,
          challenge: testChallenge2,
        })
      );
    });
  });
});
