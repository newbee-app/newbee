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
  EntityService,
  QnaEntity,
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testQnaDocParams1,
  testQnaEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import {
  elongateUuid,
  markdocToTxt,
  QnaDocParams,
} from '@newbee/api/shared/util';
import {
  testBaseCreateQnaDto1,
  testBaseUpdateQnaDto1,
} from '@newbee/shared/data-access';
import {
  internalServerError,
  qnaSlugNotFound,
  testNow1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { v4 } from 'uuid';
import { QnaService } from './qna.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  QnaEntity: jest.fn(),
}));
const mockQnaEntity = QnaEntity as jest.Mock;

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

jest.mock('@newbee/api/shared/util', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/util'),
  elongateUuid: jest.fn(),
}));
const mockElongateUuid = elongateUuid as jest.Mock;

describe('QnaService', () => {
  let service: QnaService;
  let repository: EntityRepository<QnaEntity>;
  let entityService: EntityService;
  let solrCli: SolrCli;

  const testAssignParams = {
    ...testBaseUpdateQnaDto1,
    ...(testBaseUpdateQnaDto1.questionMarkdoc && {
      questionTxt: markdocToTxt(testBaseUpdateQnaDto1.questionMarkdoc),
    }),
    ...(testBaseUpdateQnaDto1.answerMarkdoc && {
      answerTxt: markdocToTxt(testBaseUpdateQnaDto1.answerMarkdoc),
    }),
    updatedAt: testNow1,
    markedUpToDateAt: testNow1,
    upToDate: true,
  };
  const testUpdatedQna = createMock<QnaEntity>({
    ...testQnaEntity1,
    ...testBaseUpdateQnaDto1,
  });
  const testUpdatedQnaDocParams: QnaDocParams = {
    ...testQnaDocParams1,
    qna_title: testUpdatedQna.title,
    question_txt: testUpdatedQna.questionTxt,
    answer_txt: testUpdatedQna.answerTxt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QnaService,
        {
          provide: getRepositoryToken(QnaEntity),
          useValue: createMock<EntityRepository<QnaEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testQnaEntity1),
            find: jest.fn().mockResolvedValue([testQnaEntity1]),
            assign: jest.fn().mockReturnValue(testUpdatedQna),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createQnaDocParams: jest.fn().mockReturnValue(testQnaDocParams1),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
      ],
    }).compile();

    service = module.get<QnaService>(QnaService);
    repository = module.get<EntityRepository<QnaEntity>>(
      getRepositoryToken(QnaEntity)
    );
    entityService = module.get<EntityService>(EntityService);
    solrCli = module.get<SolrCli>(SolrCli);

    jest.clearAllMocks();
    mockQnaEntity.mockReturnValue(testQnaEntity1);
    mockV4.mockReturnValue(testQnaEntity1.id);
    mockElongateUuid.mockReturnValue(testQnaEntity1.slug);

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(entityService).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockQnaEntity).toBeCalledTimes(1);
      expect(mockQnaEntity).toBeCalledWith(
        testQnaEntity1.id,
        testQnaEntity1.title,
        testOrgMemberEntity1,
        testTeamEntity1,
        testQnaEntity1.questionMarkdoc,
        testQnaEntity1.answerMarkdoc
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
      expect(solrCli.addDocs).toBeCalledTimes(1);
      expect(solrCli.addDocs).toBeCalledWith(
        testOrganizationEntity1.id,
        testQnaDocParams1
      );
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

    it('should throw an InternalServerErrorException and delete if addDocs throws an error', async () => {
      jest.spyOn(solrCli, 'addDocs').mockRejectedValue(new Error('addDocs'));
      await expect(
        service.create(
          testBaseCreateQnaDto1,
          testTeamEntity1,
          testOrgMemberEntity1
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(solrCli.addDocs).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testQnaEntity1);
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
    beforeEach(() => {
      jest
        .spyOn(entityService, 'createQnaDocParams')
        .mockReturnValue(testUpdatedQnaDocParams);
    });

    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should update a qna', async () => {
      await expect(
        service.update(testQnaEntity1, testBaseUpdateQnaDto1)
      ).resolves.toEqual(testUpdatedQna);
      expect(repository.assign).toBeCalledWith(
        testQnaEntity1,
        testAssignParams
      );
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1,
        testUpdatedQnaDocParams
      );
    });

    it('should udpate the maintainer if one is specified', async () => {
      await expect(
        service.update(
          testQnaEntity1,
          testBaseUpdateQnaDto1,
          testOrgMemberEntity1
        )
      ).resolves.toEqual(testUpdatedQna);
      expect(repository.assign).toBeCalledWith(
        testQnaEntity1,
        testAssignParams
      );
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1,
        testUpdatedQnaDocParams
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testQnaEntity1, testBaseUpdateQnaDto1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(
        service.update(testQnaEntity1, testBaseUpdateQnaDto1)
      ).resolves.toEqual(testUpdatedQna);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1,
        testUpdatedQnaDocParams
      );
    });
  });

  describe('markUpToDate', () => {
    beforeEach(() => {
      jest
        .spyOn(entityService, 'createQnaDocParams')
        .mockReturnValue(testUpdatedQnaDocParams);
    });

    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testQnaEntity1, {
        markedUpToDateAt: testNow1,
        upToDate: true,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should mark the qna as up to date', async () => {
      await expect(service.markUpToDate(testQnaEntity1)).resolves.toEqual(
        testUpdatedQna
      );
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1,
        testUpdatedQnaDocParams
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(service.markUpToDate(testQnaEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(service.markUpToDate(testQnaEntity1)).resolves.toEqual(
        testUpdatedQna
      );
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1,
        testUpdatedQnaDocParams
      );
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.prepareToDelete).toBeCalledTimes(1);
      expect(entityService.prepareToDelete).toBeCalledWith(testQnaEntity1);
    });

    it('should delete a qna', async () => {
      await expect(service.delete(testQnaEntity1)).resolves.toBeUndefined();
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testQnaEntity1);
      expect(solrCli.deleteDocs).toBeCalledTimes(1);
      expect(solrCli.deleteDocs).toBeCalledWith(testOrganizationEntity1.id, {
        id: testQnaEntity1.id,
      });
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testQnaEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });

    it('should not throw if deleteDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'deleteDocs')
        .mockRejectedValue(new Error('deleteDocs'));
      await expect(service.delete(testQnaEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toBeCalledTimes(1);
    });
  });
});
