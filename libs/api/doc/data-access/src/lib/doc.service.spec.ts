import { createMock } from '@golevelup/ts-jest';
import Markdoc from '@markdoc/markdoc';
import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  DocDocParams,
  DocEntity,
  EntityService,
  testDocDocParams1,
  testDocEntity1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import { elongateUuid } from '@newbee/api/shared/util';
import { TeamService } from '@newbee/api/team/data-access';
import markdocTxtRenderer from '@newbee/markdoc-txt-renderer';
import {
  docSlugNotFound,
  internalServerError,
  strToContent,
  testCreateDocDto1,
  testNow1,
  testNowDayjs1,
  testUpdateDocDto1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
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

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('DocService', () => {
  let service: DocService;
  let em: EntityManager;
  let entityService: EntityService;
  let solrCli: SolrCli;
  let teamService: TeamService;
  let orgMemberService: OrgMemberService;

  const testUpdatedDoc = createMock<DocEntity>({
    ...testDocEntity1,
    ...testUpdateDocDto1,
    team: testTeamEntity1,
    maintainer: testOrgMemberEntity1,
  });
  const testUpdatedDocDocParams = new DocDocParams(testUpdatedDoc);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOneOrFail: jest.fn().mockResolvedValue(testDocEntity1),
            findAndCount: jest.fn().mockResolvedValue([[testDocEntity1], 1]),
            assign: jest.fn().mockReturnValue(testUpdatedDoc),
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

    service = module.get<DocService>(DocService);
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);
    solrCli = module.get<SolrCli>(SolrCli);
    teamService = module.get<TeamService>(TeamService);
    orgMemberService = module.get<OrgMemberService>(OrgMemberService);

    jest.clearAllMocks();
    mockDocEntity.mockReturnValue(testDocEntity1);
    mockV4.mockReturnValue(testDocEntity1.id);
    mockElongateUuid.mockReturnValue(testDocEntity1.slug);

    jest.useFakeTimers().setSystemTime(testNow1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(solrCli).toBeDefined();
    expect(teamService).toBeDefined();
    expect(orgMemberService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(teamService.findOneBySlug).toHaveBeenCalledTimes(1);
      expect(teamService.findOneBySlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testCreateDocDto1.team,
      );
      expect(mockDocEntity).toHaveBeenCalledTimes(1);
      expect(mockDocEntity).toHaveBeenCalledWith(
        testDocEntity1.id,
        testCreateDocDto1.title,
        testCreateDocDto1.upToDateDuration,
        testTeamEntity1,
        testOrgMemberEntity1,
        testCreateDocDto1.docMarkdoc,
      );
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testDocEntity1);
    });

    it('should create a doc', async () => {
      await expect(
        service.create(testCreateDocDto1, testOrgMemberEntity1),
      ).resolves.toEqual(testDocEntity1);
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testDocDocParams1,
      );
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testCreateDocDto1, testOrgMemberEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw an InternalServerErrorException and delete if addDocs throws an error', async () => {
      jest.spyOn(solrCli, 'addDocs').mockRejectedValue(new Error('addDocs'));
      await expect(
        service.create(testCreateDocDto1, testOrgMemberEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testDocEntity1);
    });
  });

  describe('findOneBySlug', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        DocEntity,
        testDocEntity1.slug,
      );
    });

    it('should find a slug', async () => {
      await expect(service.findOneBySlug(testDocEntity1.slug)).resolves.toEqual(
        testDocEntity1,
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(service.findOneBySlug(testDocEntity1.slug)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should throw a NotFoundException if doc cannot be found', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(service.findOneBySlug(testDocEntity1.slug)).rejects.toThrow(
        new NotFoundException(docSlugNotFound),
      );
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(teamService.findOneBySlug).toHaveBeenCalledTimes(1);
      expect(teamService.findOneBySlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testCreateDocDto1.team,
      );

      const docContent = strToContent(testUpdateDocDto1.docMarkdoc as string);
      const docTxt = markdocTxtRenderer(docContent);
      const docHtml = Markdoc.renderers.html(docContent);

      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testDocEntity1, {
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
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should update a doc', async () => {
      await expect(
        service.update(testDocEntity1, testUpdateDocDto1),
      ).resolves.toEqual(testUpdatedDoc);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testUpdatedDocDocParams,
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testDocEntity1, testUpdateDocDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(
        service.update(testDocEntity1, testUpdateDocDto1),
      ).resolves.toEqual(testUpdatedDoc);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testUpdatedDocDocParams,
      );
    });
  });

  describe('markUpToDate', () => {
    afterEach(async () => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testDocEntity1, {
        markedUpToDateAt: testNow1,
        outOfDateAt: testNowDayjs1
          .add(dayjs.duration(testOrganizationEntity1.upToDateDuration))
          .toDate(),
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should mark the doc as up to date', async () => {
      await expect(service.markUpToDate(testDocEntity1)).resolves.toEqual(
        testUpdatedDoc,
      );
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testUpdatedDocDocParams,
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(service.markUpToDate(testDocEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(service.markUpToDate(testDocEntity1)).resolves.toEqual(
        testUpdatedDoc,
      );
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testUpdatedDocDocParams,
      );
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(testDocEntity1);
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testDocEntity1);
    });

    it('should delete a doc', async () => {
      await expect(service.delete(testDocEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        {
          id: testDocEntity1.id,
        },
      );
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testDocEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should not throw if deleteDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'deleteDocs')
        .mockRejectedValue(new Error('deleteDocs'));
      await expect(service.delete(testDocEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
    });
  });
});
