import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  DocEntity,
  testDocDocParams1,
  testDocEntity1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import { elongateUuid, renderMarkdoc } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import {
  docSlugNotFound,
  testCreateDocDto1,
  testNow1,
  testNowDayjs1,
  testUpdateDocDto1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
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
  let em: EntityManager;
  let txEm: EntityManager;
  let solrCli: SolrCli;
  let orgMemberService: OrgMemberService;
  let teamService: TeamService;

  beforeEach(async () => {
    txEm = createMock<EntityManager>({
      assign: jest.fn().mockReturnValue(testDocEntity1),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testDocEntity1),
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

    service = module.get(DocService);
    em = module.get(EntityManager);
    solrCli = module.get(SolrCli);
    orgMemberService = module.get(OrgMemberService);
    teamService = module.get(TeamService);

    jest.clearAllMocks();
    mockDocEntity.mockReturnValue(testDocEntity1);
    mockElongateUuid.mockReturnValue(testDocEntity1.id);

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
    it('should create a doc', async () => {
      await expect(
        service.create(testCreateDocDto1, testOrgMemberEntity1),
      ).resolves.toEqual(testDocEntity1);
      expect(teamService.findOneByOrgAndSlug).toHaveBeenCalledTimes(1);
      expect(teamService.findOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testCreateDocDto1.team,
      );
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(mockDocEntity).toHaveBeenCalledTimes(1);
      expect(mockDocEntity).toHaveBeenCalledWith(
        testCreateDocDto1.title,
        testCreateDocDto1.upToDateDuration,
        testTeamEntity1,
        testOrgMemberEntity1,
        testCreateDocDto1.docMarkdoc,
      );
      expect(txEm.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.persistAndFlush).toHaveBeenCalledWith(testDocEntity1);
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testDocDocParams1,
      );
    });
  });

  describe('findOneBySlug', () => {
    afterEach(() => {
      expect(mockElongateUuid).toHaveBeenCalledTimes(1);
      expect(mockElongateUuid).toHaveBeenCalledWith(testDocEntity1.slug);
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(DocEntity, testDocEntity1.id);
    });

    it('should find a slug', async () => {
      await expect(service.findOneBySlug(testDocEntity1.slug)).resolves.toEqual(
        testDocEntity1,
      );
    });

    it('should throw a NotFoundException if doc cannot be found', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(service.findOneBySlug(testDocEntity1.slug)).rejects.toThrow(
        new NotFoundException(docSlugNotFound),
      );
    });
  });

  describe('update', () => {
    it('should update a doc', async () => {
      await expect(
        service.update(testDocEntity1, testUpdateDocDto1),
      ).resolves.toEqual(testDocEntity1);
      expect(teamService.findOneByOrgAndSlug).toHaveBeenCalledTimes(1);
      expect(teamService.findOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testUpdateDocDto1.team,
      );
      expect(orgMemberService.findOneByOrgAndSlug).toHaveBeenCalledTimes(1);
      expect(orgMemberService.findOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testUpdateDocDto1.maintainer,
      );
      const { txt: docTxt, html: docHtml } = renderMarkdoc(
        testUpdateDocDto1.docMarkdoc,
      );
      expect(txEm.assign).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledWith(testDocEntity1, {
        ...testUpdateDocDto1,
        docTxt,
        docHtml,
        team: testTeamEntity1,
        maintainer: testOrgMemberEntity1,
        markedUpToDateAt: testNow1,
        outOfDateAt: testNowDayjs1
          .add(dayjs.duration(testUpdateDocDto1.upToDateDuration as string))
          .toDate(),
      });
      expect(txEm.flush).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testDocDocParams1,
      );
    });
  });

  describe('markUpToDate', () => {
    it('should mark the doc as up to date', async () => {
      await expect(service.markUpToDate(testDocEntity1)).resolves.toEqual(
        testDocEntity1,
      );
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledTimes(1);
      expect(txEm.assign).toHaveBeenCalledWith(testDocEntity1, {
        markedUpToDateAt: testNow1,
        outOfDateAt: testNowDayjs1
          .add(dayjs.duration(testOrganizationEntity1.upToDateDuration))
          .toDate(),
      });
      expect(txEm.flush).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testDocDocParams1,
      );
    });
  });

  describe('delete', () => {
    it('should delete a doc', async () => {
      await expect(service.delete(testDocEntity1)).resolves.toBeUndefined();
      expect(em.transactional).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(txEm.removeAndFlush).toHaveBeenCalledWith(testDocEntity1);
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        {
          id: testDocEntity1.id,
        },
      );
    });
  });
});
