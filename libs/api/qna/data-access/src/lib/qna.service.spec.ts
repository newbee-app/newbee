import { createMock } from '@golevelup/ts-jest';
import { NotFoundError } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  QnaEntity,
  testOrgMemberEntity1,
  testQnaEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import { elongateUuid } from '@newbee/api/shared/util';
import {
  testBaseCreateQnaDto1,
  testBaseUpdateQnaDto1,
} from '@newbee/shared/data-access';
import { internalServerError, qnaSlugNotFound } from '@newbee/shared/util';
import { QnaService } from './qna.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  QnaEntity: jest.fn(),
}));
const mockQnaEntity = QnaEntity as jest.Mock;

jest.mock('@newbee/api/shared/util', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/util'),
  elongateUuid: jest.fn(),
}));
const mockElongateUuid = elongateUuid as jest.Mock;

describe('QnaService', () => {
  let service: QnaService;
  let repository: EntityRepository<QnaEntity>;

  const testUpdatedQnaEntity = { ...testQnaEntity1, ...testBaseUpdateQnaDto1 };
  const now = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QnaService,
        {
          provide: getRepositoryToken(QnaEntity),
          useValue: createMock<EntityRepository<QnaEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testQnaEntity1),
            assign: jest.fn().mockResolvedValue(testUpdatedQnaEntity),
          }),
        },
      ],
    }).compile();

    service = module.get<QnaService>(QnaService);
    repository = module.get<EntityRepository<QnaEntity>>(
      getRepositoryToken(QnaEntity)
    );

    jest.clearAllMocks();
    mockQnaEntity.mockReturnValue(testQnaEntity1);
    mockElongateUuid.mockReturnValue(testQnaEntity1.slug);

    jest.useFakeTimers().setSystemTime(now);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockQnaEntity).toBeCalledTimes(1);
      expect(mockQnaEntity).toBeCalledWith(
        testQnaEntity1.title,
        testOrgMemberEntity1,
        testTeamEntity1,
        testQnaEntity1.questionMarkdown,
        testQnaEntity1.answerMarkdown
      );
      expect(repository.persistAndFlush).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledWith(testQnaEntity1);
    });

    it('should create a qna', async () => {
      await expect(
        service.create(
          testBaseCreateQnaDto1,
          testTeamEntity1,
          testOrgMemberEntity1
        )
      ).resolves.toEqual(testQnaEntity1);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(
          testBaseCreateQnaDto1,
          testTeamEntity1,
          testOrgMemberEntity1
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneBySlug', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith(testQnaEntity1.slug);
    });

    it('should find a qna using the slug', async () => {
      await expect(service.findOneBySlug(testQnaEntity1.slug)).resolves.toEqual(
        testQnaEntity1
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(service.findOneBySlug(testQnaEntity1.slug)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });

    it('should throw a BadRequestException if slug does not exist', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(service.findOneBySlug(testQnaEntity1.slug)).rejects.toThrow(
        new BadRequestException(qnaSlugNotFound)
      );
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should update a qna', async () => {
      await expect(
        service.update(testQnaEntity1, testBaseUpdateQnaDto1)
      ).resolves.toEqual(testUpdatedQnaEntity);
      expect(repository.assign).toBeCalledWith(testQnaEntity1, {
        ...testBaseUpdateQnaDto1,
        updatedAt: now,
        markedUpToDateAt: now,
        upToDate: true,
      });
    });

    it('should udpate the maintainer if one is specified', async () => {
      await expect(
        service.update(
          testQnaEntity1,
          testBaseUpdateQnaDto1,
          testOrgMemberEntity1
        )
      ).resolves.toEqual(testUpdatedQnaEntity);
      expect(repository.assign).toBeCalledWith(testQnaEntity1, {
        ...testBaseUpdateQnaDto1,
        updatedAt: now,
        markedUpToDateAt: now,
        upToDate: true,
        maintainer: testOrgMemberEntity1,
      });
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testQnaEntity1, testBaseUpdateQnaDto1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    it('should delete a qna', async () => {
      await expect(service.delete(testQnaEntity1)).resolves.toBeUndefined();
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testQnaEntity1);
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testQnaEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });
  });
});
