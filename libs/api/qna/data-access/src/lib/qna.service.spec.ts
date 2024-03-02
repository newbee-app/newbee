import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  QnaEntity,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaDocParams1,
  testQnaEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import { elongateUuid, renderMarkdoc } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  qnaSlugNotFound,
  testCreateQnaDto1,
  testNow1,
  testNowDayjs1,
  testUpdateQnaDto1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
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
  let em: EntityManager;
  let txEm: EntityManager;
  let solrCli: SolrCli;
  let orgMemberService: OrgMemberService;
  let teamService: TeamService;

  beforeEach(async () => {
    txEm = createMock<EntityManager>({
      assign: jest.fn().mockReturnValue(testQnaEntity1),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QnaService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testQnaEntity1),
            transactional: jest.fn().mockImplementation(async (cb) => {
              return await cb(txEm);
            }),
          }),
        },
        {
          provide: SolrCli,
          useValue: createMock<SolrCli>(),
        },
        {
          provide: OrgMemberService,
          useValue: createMock<OrgMemberService>({
            findOneByOrgAndSlug: jest
              .fn()
              .mockResolvedValue(testOrgMemberEntity1),
          }),
        },
        {
          provide: TeamService,
          useValue: createMock<TeamService>({
            findOneByOrgAndSlug: jest.fn().mockResolvedValue(testTeamEntity1),
          }),
        },
      ],
    }).compile();

    service = module.get(QnaService);
    em = module.get(EntityManager);
    solrCli = module.get(SolrCli);
    orgMemberService = module.get(OrgMemberService);
    teamService = module.get(TeamService);

    jest.clearAllMocks();
    mockQnaEntity.mockReturnValue(testQnaEntity1);
    mockElongateUuid.mockReturnValue(testQnaEntity1.slug);

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(txEm).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(orgMemberService).toBeDefined();
    expect(teamService).toBeDefined();
  });

  describe('create', () => {
    it('should create a qna', async () => {
      await expect(
        service.create(testCreateQnaDto1, testOrgMemberEntity1),
      ).resolves.toEqual(testQnaEntity1);
      expect(teamService.findOneByOrgAndSlug).toHaveBeenCalledTimes(1);
      expect(teamService.findOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testCreateQnaDto1.team,
      );
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(mockQnaEntity).toHaveBeenCalledTimes(1);
      expect(mockQnaEntity).toHaveBeenCalledWith(
        testQnaEntity1.title,
        testTeamEntity1,
        testOrgMemberEntity1,
        testQnaEntity1.questionMarkdoc,
        testQnaEntity1.answerMarkdoc,
      );
      expect(txEm.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.persistAndFlush).toHaveBeenCalledWith(testQnaEntity1);
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testQnaDocParams1,
      );
    });
  });

  describe('findOneBySlug', () => {
    afterEach(() => {
      expect(mockElongateUuid).toHaveBeenCalledTimes(1);
      expect(mockElongateUuid).toHaveBeenCalledWith(testQnaEntity1.slug);
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(QnaEntity, testQnaEntity1.slug);
    });

    it('should find a qna using the slug', async () => {
      await expect(service.findOneBySlug(testQnaEntity1.slug)).resolves.toEqual(
        testQnaEntity1,
      );
    });

    it('should throw a NotFoundException if slug does not exist', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(service.findOneBySlug(testQnaEntity1.slug)).rejects.toThrow(
        new NotFoundException(qnaSlugNotFound),
      );
    });
  });

  describe('update', () => {
    it('should update a qna', async () => {
      await expect(
        service.update(testQnaEntity1, testUpdateQnaDto1),
      ).resolves.toEqual(testQnaEntity1);
      expect(teamService.findOneByOrgAndSlug).toHaveBeenCalledTimes(1);
      expect(teamService.findOneByOrgAndSlug).toHaveBeenCalledWith(
        testQnaEntity1.organization,
        testUpdateQnaDto1.team,
      );
      expect(em.transactional).toHaveBeenCalledTimes(1);
      const { txt: questionTxt, html: questionHtml } = renderMarkdoc(
        testUpdateQnaDto1.questionMarkdoc as string,
      );
      const { txt: answerTxt, html: answerHtml } = renderMarkdoc(
        testUpdateQnaDto1.answerMarkdoc,
      );
      expect(txEm.assign).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledWith(testQnaEntity1, {
        ...testUpdateQnaDto1,
        questionTxt,
        questionHtml,
        answerTxt,
        answerHtml,
        team: testTeamEntity1,
        maintainer: testOrgMemberEntity1,
        markedUpToDateAt: testNow1,
        outOfDateAt: testNowDayjs1
          .add(dayjs.duration(testUpdateQnaDto1.upToDateDuration as string))
          .toDate(),
      });
      expect(txEm.flush).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testQnaDocParams1,
      );
    });
  });

  describe('markUpToDate', () => {
    it('should mark the qna as up to date', async () => {
      await expect(service.markUpToDate(testQnaEntity1)).resolves.toEqual(
        testQnaEntity1,
      );
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledWith(testQnaEntity1, {
        markedUpToDateAt: testNow1,
        outOfDateAt: testNowDayjs1
          .add(dayjs.duration(testOrganizationEntity1.upToDateDuration))
          .toDate(),
      });
      expect(txEm.flush).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testQnaDocParams1,
      );
    });
  });

  describe('delete', () => {
    it('should delete a qna', async () => {
      await expect(service.delete(testQnaEntity1)).resolves.toBeUndefined();
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledWith(testQnaEntity1);
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        {
          id: testQnaEntity1.id,
        },
      );
    });
  });
});
