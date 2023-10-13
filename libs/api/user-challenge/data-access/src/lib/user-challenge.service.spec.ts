import { createMock } from '@golevelup/ts-jest';
import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  UserChallengeEntity,
  testUserChallengeEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  internalServerError,
  userChallengeEmailNotFound,
  userChallengeIdNotFound,
} from '@newbee/shared/util';
import { UserChallengeService } from './user-challenge.service';

const testChallenge2 = 'challenge2';
const testUpdatedUserChallengeEntity = {
  ...testUserChallengeEntity1,
  challenge: testChallenge2,
};

describe('UserChallengeService', () => {
  let service: UserChallengeService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserChallengeService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            getReference: jest.fn().mockReturnValue(testUserChallengeEntity1),
            findOneOrFail: jest
              .fn()
              .mockResolvedValue(testUserChallengeEntity1),
            assign: jest.fn().mockReturnValue(testUpdatedUserChallengeEntity),
          }),
        },
      ],
    }).compile();

    service = module.get<UserChallengeService>(UserChallengeService);
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
        UserChallengeEntity,
        testUserChallengeEntity1.user.id,
      );
    });

    it('should get a single user challenge by user id', async () => {
      await expect(
        service.findOneById(testUserChallengeEntity1.user.id),
      ).resolves.toEqual(testUserChallengeEntity1);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneById(testUserChallengeEntity1.user.id),
      ).rejects.toThrow(new NotFoundException(userChallengeIdNotFound));
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneById(testUserChallengeEntity1.user.id),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneByEmail', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toBeCalledTimes(1);
      expect(em.findOneOrFail).toBeCalledWith(UserChallengeEntity, {
        user: { email: testUserEntity1.email },
      });
    });

    it('should get a single user challenge by user email', async () => {
      await expect(
        service.findOneByEmail(testUserEntity1.email),
      ).resolves.toEqual(testUserChallengeEntity1);
    });

    it('should throw a NotFoundException if findOneOrFail throws a NotFoundError', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity1.email),
      ).rejects.toThrow(new NotFoundException(userChallengeEmailNotFound));
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByEmail(testUserEntity1.email),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(em.assign).toBeCalledTimes(1);
      expect(em.assign).toBeCalledWith(testUserChallengeEntity1, {
        challenge: testChallenge2,
      });
    });

    it('should update a user challenge', async () => {
      await expect(
        service.update(testUserChallengeEntity1, testChallenge2),
      ).resolves.toEqual(testUpdatedUserChallengeEntity);
    });

    describe('byId', () => {
      it('should find and update a user challenge by ID', async () => {
        await expect(
          service.updateById(testUserChallengeEntity1.user.id, testChallenge2),
        ).resolves.toEqual(testUpdatedUserChallengeEntity);
        expect(em.findOneOrFail).toBeCalledTimes(1);
        expect(em.findOneOrFail).toBeCalledWith(
          UserChallengeEntity,
          testUserChallengeEntity1.user.id,
        );
      });
    });

    describe('byEmail', () => {
      it('should find and update a user challenge by email', async () => {
        await expect(
          service.updateByEmail(testUserEntity1.email, testChallenge2),
        ).resolves.toEqual(testUpdatedUserChallengeEntity);
        expect(em.findOneOrFail).toBeCalledTimes(1);
        expect(em.findOneOrFail).toBeCalledWith(UserChallengeEntity, {
          user: { email: testUserEntity1.email },
        });
      });
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testUserChallengeEntity1, testChallenge2),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });
});
