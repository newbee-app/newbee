import { createMock } from '@golevelup/ts-jest';
import { NotFoundError } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DocEntity,
  testDocEntity1,
  testOrgMemberEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import { elongateUuid } from '@newbee/api/shared/util';
import {
  testBaseCreateDocDto1,
  testBaseUpdateDocDto1,
} from '@newbee/shared/data-access';
import { docSlugNotFound, internalServerError } from '@newbee/shared/util';
import { DocService } from './doc.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  DocEntity: jest.fn(),
}));
const mockDocEntity = DocEntity as jest.Mock;

jest.mock('@newbee/api/shared/util', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/util'),
  elongateUuid: jest.fn(),
}));
const mockElongateUuid = elongateUuid as jest.Mock;

describe('DocService', () => {
  let service: DocService;
  let repository: EntityRepository<DocEntity>;

  const testUpdatedDocEntity = { ...testDocEntity1, ...testBaseUpdateDocDto1 };
  const now = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocService,
        {
          provide: getRepositoryToken(DocEntity),
          useValue: createMock<EntityRepository<DocEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testDocEntity1),
            assign: jest.fn().mockResolvedValue(testUpdatedDocEntity),
          }),
        },
      ],
    }).compile();

    service = module.get<DocService>(DocService);
    repository = module.get<EntityRepository<DocEntity>>(
      getRepositoryToken(DocEntity)
    );

    jest.clearAllMocks();
    mockDocEntity.mockReturnValue(testDocEntity1);
    mockElongateUuid.mockReturnValue(testDocEntity1.slug);

    jest.useFakeTimers().setSystemTime(now);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockDocEntity).toBeCalledTimes(1);
      expect(mockDocEntity).toBeCalledWith(
        testDocEntity1.title,
        testOrgMemberEntity1,
        testTeamEntity1,
        testDocEntity1.rawMarkdown
      );
      expect(repository.persistAndFlush).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledWith(testDocEntity1);
    });

    it('should create a doc', async () => {
      await expect(
        service.create(
          testBaseCreateDocDto1,
          testTeamEntity1,
          testOrgMemberEntity1
        )
      ).resolves.toEqual(testDocEntity1);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(
          testBaseCreateDocDto1,
          testTeamEntity1,
          testOrgMemberEntity1
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneBySlug', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith(testDocEntity1.slug);
    });

    it('should find a slug', async () => {
      await expect(service.findOneBySlug(testDocEntity1.slug)).resolves.toEqual(
        testDocEntity1
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(service.findOneBySlug(testDocEntity1.slug)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });

    it('should throw a NotFoundException if doc cannot be found', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(service.findOneBySlug(testDocEntity1.slug)).rejects.toThrow(
        new NotFoundException(docSlugNotFound)
      );
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testDocEntity1, {
        ...testBaseUpdateDocDto1,
        updatedAt: now,
        markedUpToDateAt: now,
        upToDate: true,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should update a doc', async () => {
      await expect(
        service.update(testDocEntity1, testBaseUpdateDocDto1)
      ).resolves.toEqual(testUpdatedDocEntity);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testDocEntity1, testBaseUpdateDocDto1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testDocEntity1);
    });

    it('should delete a doc', async () => {
      await expect(service.delete(testDocEntity1)).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testDocEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });
  });
});
