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
  EntityService,
  testDocDocParams1,
  testDocEntity1,
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import {
  DocDocParams,
  elongateUuid,
  markdocToTxt,
} from '@newbee/api/shared/util';
import {
  testBaseCreateDocDto1,
  testBaseUpdateDocDto1,
} from '@newbee/shared/data-access';
import {
  docSlugNotFound,
  internalServerError,
  testNow1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import { v4 } from 'uuid';
import { DocService } from './doc.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  DocEntity: jest.fn(),
}));
const mockDocEntity = DocEntity as jest.Mock;

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

describe('DocService', () => {
  let service: DocService;
  let repository: EntityRepository<DocEntity>;
  let entityService: EntityService;
  let solrCli: SolrCli;

  const testUpdatedDoc = createMock<DocEntity>({
    ...testDocEntity1,
    ...testBaseUpdateDocDto1,
  });
  const testUpdatedDocDocParams: DocDocParams = {
    ...testDocDocParams1,
    doc_title: testUpdatedDoc.title,
    doc_txt: testUpdatedDoc.docTxt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocService,
        {
          provide: getRepositoryToken(DocEntity),
          useValue: createMock<EntityRepository<DocEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testDocEntity1),
            find: jest.fn().mockResolvedValue([testDocEntity1]),
            assign: jest.fn().mockReturnValue(testUpdatedDoc),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>({
            createDocDocParams: jest.fn().mockReturnValue(testDocDocParams1),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
      ],
    }).compile();

    service = module.get<DocService>(DocService);
    repository = module.get<EntityRepository<DocEntity>>(
      getRepositoryToken(DocEntity)
    );
    entityService = module.get<EntityService>(EntityService);
    solrCli = module.get<SolrCli>(SolrCli);

    jest.clearAllMocks();
    mockDocEntity.mockReturnValue(testDocEntity1);
    mockV4.mockReturnValue(testDocEntity1.id);
    mockElongateUuid.mockReturnValue(testDocEntity1.slug);

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockDocEntity).toBeCalledTimes(1);
      expect(mockDocEntity).toBeCalledWith(
        testDocEntity1.id,
        testDocEntity1.title,
        testOrgMemberEntity1,
        testTeamEntity1,
        testDocEntity1.docMarkdoc
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
      expect(solrCli.addDocs).toBeCalledTimes(1);
      expect(solrCli.addDocs).toBeCalledWith(
        testOrganizationEntity1.id,
        testDocDocParams1
      );
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

    it('should throw an InternalServerErrorException and delete if addDocs throws an error', async () => {
      jest.spyOn(solrCli, 'addDocs').mockRejectedValue(new Error('addDocs'));
      await expect(
        service.create(
          testBaseCreateDocDto1,
          testTeamEntity1,
          testOrgMemberEntity1
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(solrCli.addDocs).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testDocEntity1);
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
    beforeEach(() => {
      jest
        .spyOn(entityService, 'createDocDocParams')
        .mockReturnValue(testUpdatedDocDocParams);
    });

    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testDocEntity1, {
        ...testBaseUpdateDocDto1,
        ...(testBaseUpdateDocDto1.docMarkdoc && {
          docTxt: markdocToTxt(testBaseUpdateDocDto1.docMarkdoc),
        }),
        updatedAt: testNow1,
        markedUpToDateAt: testNow1,
        upToDate: true,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should update a doc', async () => {
      await expect(
        service.update(testDocEntity1, testBaseUpdateDocDto1)
      ).resolves.toEqual(testUpdatedDoc);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1.id,
        testUpdatedDocDocParams
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testDocEntity1, testBaseUpdateDocDto1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(
        service.update(testDocEntity1, testBaseUpdateDocDto1)
      ).resolves.toEqual(testUpdatedDoc);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1.id,
        testUpdatedDocDocParams
      );
    });
  });

  describe('markUpToDate', () => {
    beforeEach(() => {
      jest
        .spyOn(entityService, 'createDocDocParams')
        .mockReturnValue(testUpdatedDocDocParams);
    });

    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testDocEntity1, {
        markedUpToDateAt: testNow1,
        upToDate: true,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should mark the doc as up to date', async () => {
      await expect(service.markUpToDate(testDocEntity1)).resolves.toEqual(
        testUpdatedDoc
      );
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1.id,
        testUpdatedDocDocParams
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(service.markUpToDate(testDocEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(service.markUpToDate(testDocEntity1)).resolves.toEqual(
        testUpdatedDoc
      );
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1.id,
        testUpdatedDocDocParams
      );
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toBeCalledTimes(1);
      expect(entityService.safeToDelete).toBeCalledWith(testDocEntity1);
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testDocEntity1);
    });

    it('should delete a doc', async () => {
      await expect(service.delete(testDocEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toBeCalledTimes(1);
      expect(solrCli.deleteDocs).toBeCalledWith(testOrganizationEntity1.id, {
        id: testDocEntity1.id,
      });
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testDocEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });

    it('should not throw if deleteDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'deleteDocs')
        .mockRejectedValue(new Error('deleteDocs'));
      await expect(service.delete(testDocEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toBeCalledTimes(1);
    });
  });
});
