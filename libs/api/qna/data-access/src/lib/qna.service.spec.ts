import { createMock } from '@golevelup/ts-jest';
import Markdoc from '@markdoc/markdoc';
import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  EntityService,
  QnaDocParams,
  QnaEntity,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaDocParams1,
  testQnaEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import { elongateUuid } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import markdocTxtRenderer from '@newbee/markdoc-txt-renderer';
import {
  internalServerError,
  qnaSlugNotFound,
  strToContent,
  testBaseCreateQnaDto1,
  testBaseUpdateQnaDto1,
  testNow1,
  testNowDayjs1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
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

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('QnaService', () => {
  let service: QnaService;
  let em: EntityManager;
  let entityService: EntityService;
  let solrCli: SolrCli;
  let teamService: TeamService;
  let orgMemberService: OrgMemberService;

  const testUpdatedQna = createMock<QnaEntity>({
    ...testQnaEntity1,
    ...testBaseUpdateQnaDto1,
    team: testTeamEntity1,
    maintainer: testOrgMemberEntity1,
  });
  const testUpdatedQnaDocParams = new QnaDocParams(testUpdatedQna);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QnaService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOneOrFail: jest.fn().mockResolvedValue(testQnaEntity1),
            findAndCount: jest.fn().mockResolvedValue([[testQnaEntity1], 1]),
            assign: jest.fn().mockReturnValue(testUpdatedQna),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            findOneBySlug: jest.fn().mockResolvedValue(testTeamEntity1),
          }),
        },
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            findOneByOrgAndSlug: jest
              .fn()
              .mockResolvedValue(testOrgMemberEntity1),
          }),
        },
      ],
    }).compile();

    service = module.get<QnaService>(QnaService);
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);
    solrCli = module.get<SolrCli>(SolrCli);
    teamService = module.get<TeamService>(TeamService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);

    jest.clearAllMocks();
    mockQnaEntity.mockReturnValue(testQnaEntity1);
    mockV4.mockReturnValue(testQnaEntity1.id);
    mockElongateUuid.mockReturnValue(testQnaEntity1.slug);

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(teamService).toBeDefined();
    expect(orgMemberService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockQnaEntity).toHaveBeenCalledTimes(1);
      expect(mockQnaEntity).toHaveBeenCalledWith(
        testQnaEntity1.id,
        testQnaEntity1.title,
        testTeamEntity1,
        testOrgMemberEntity1,
        testQnaEntity1.questionMarkdoc,
        testQnaEntity1.answerMarkdoc,
      );
      expect(teamService.findOneBySlug).toHaveBeenCalledTimes(1);
      expect(teamService.findOneBySlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testBaseCreateQnaDto1.team,
      );
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testQnaEntity1);
    });

    it('should create a qna', async () => {
      await expect(
        service.create(testBaseCreateQnaDto1, testOrgMemberEntity1),
      ).resolves.toEqual(testQnaEntity1);
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testQnaDocParams1,
      );
      expect(markdocTxtRenderer(null)).toEqual('');
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testBaseCreateQnaDto1, testOrgMemberEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw an InternalServerErrorException and delete if addDocs throws an error', async () => {
      jest.spyOn(solrCli, 'addDocs').mockRejectedValue(new Error('addDocs'));
      await expect(
        service.create(testBaseCreateQnaDto1, testOrgMemberEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testQnaEntity1);
    });
  });

  describe('findOneBySlug', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        QnaEntity,
        testQnaEntity1.slug,
      );
    });

    it('should find a qna using the slug', async () => {
      await expect(service.findOneBySlug(testQnaEntity1.slug)).resolves.toEqual(
        testQnaEntity1,
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(service.findOneBySlug(testQnaEntity1.slug)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should throw a BadRequestException if slug does not exist', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(service.findOneBySlug(testQnaEntity1.slug)).rejects.toThrow(
        new BadRequestException(qnaSlugNotFound),
      );
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(teamService.findOneBySlug).toHaveBeenCalledTimes(1);
      expect(teamService.findOneBySlug).toHaveBeenCalledWith(
        testQnaEntity1.organization,
        testBaseUpdateQnaDto1.team,
      );

      const questionContent = strToContent(
        testBaseUpdateQnaDto1.questionMarkdoc as string,
      );
      const questionTxt = markdocTxtRenderer(questionContent);
      const questionHtml = Markdoc.renderers.html(questionContent);

      const answerContent = strToContent(
        testBaseUpdateQnaDto1.answerMarkdoc as string,
      );
      const answerTxt = markdocTxtRenderer(answerContent);
      const answerHtml = Markdoc.renderers.html(answerContent);

      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testQnaEntity1, {
        ...testBaseUpdateQnaDto1,
        questionTxt,
        questionHtml,
        answerTxt,
        answerHtml,
        team: testTeamEntity1,
        maintainer: testOrgMemberEntity1,
        markedUpToDateAt: testNow1,
        outOfDateAt: testNowDayjs1
          .add(dayjs.duration(testBaseUpdateQnaDto1.upToDateDuration as string))
          .toDate(),
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should update a qna', async () => {
      await expect(
        service.update(testQnaEntity1, testBaseUpdateQnaDto1),
      ).resolves.toEqual(testUpdatedQna);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testUpdatedQnaDocParams,
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testQnaEntity1, testBaseUpdateQnaDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(
        service.update(testQnaEntity1, testBaseUpdateQnaDto1),
      ).resolves.toEqual(testUpdatedQna);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testUpdatedQnaDocParams,
      );
    });
  });

  describe('markUpToDate', () => {
    afterEach(async () => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testQnaEntity1, {
        markedUpToDateAt: testNow1,
        outOfDateAt: testNowDayjs1
          .add(dayjs.duration(testOrganizationEntity1.upToDateDuration))
          .toDate(),
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should mark the qna as up to date', async () => {
      await expect(service.markUpToDate(testQnaEntity1)).resolves.toEqual(
        testUpdatedQna,
      );
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testUpdatedQnaDocParams,
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(service.markUpToDate(testQnaEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(service.markUpToDate(testQnaEntity1)).resolves.toEqual(
        testUpdatedQna,
      );
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testUpdatedQnaDocParams,
      );
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(testQnaEntity1);
    });

    it('should delete a qna', async () => {
      await expect(service.delete(testQnaEntity1)).resolves.toBeUndefined();
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testQnaEntity1);
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        {
          id: testQnaEntity1.id,
        },
      );
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testQnaEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should not throw if deleteDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'deleteDocs')
        .mockRejectedValue(new Error('deleteDocs'));
      await expect(service.delete(testQnaEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
    });
  });
});
