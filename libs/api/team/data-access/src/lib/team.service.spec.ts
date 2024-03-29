import { createMock } from '@golevelup/ts-jest';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DocEntity,
  EntityService,
  QnaEntity,
  TeamDocParams,
  TeamEntity,
  testDocDocParams1,
  testDocEntity1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaDocParams1,
  testQnaEntity1,
  testTeamDocParams1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import {
  internalServerError,
  teamSlugNotFound,
  teamSlugTakenBadRequest,
  testBaseCreateTeamDto1,
  testBaseUpdateTeamDto1,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { TeamService } from './team.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  TeamEntity: jest.fn(),
}));
const mockTeamEntity = TeamEntity as jest.Mock;

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('TeamService', () => {
  let service: TeamService;
  let em: EntityManager;
  let entityService: EntityService;
  let solrCli: SolrCli;

  const testUpdatedTeam = { ...testTeamEntity1, ...testBaseUpdateTeamDto1 };
  const testUpdatedTeamDocParams = new TeamDocParams(testUpdatedTeam);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testTeamEntity1),
            findOneOrFail: jest.fn().mockResolvedValue(testTeamEntity1),
            find: jest.fn().mockResolvedValue([testTeamEntity1]),
            assign: jest.fn().mockReturnValue(testUpdatedTeam),
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
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);
    solrCli = module.get<SolrCli>(SolrCli);

    jest.clearAllMocks();
    mockTeamEntity.mockReturnValue(testTeamEntity1);
    mockV4.mockReturnValue(testTeamEntity1.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
    expect(solrCli).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockTeamEntity).toHaveBeenCalledTimes(1);
      expect(mockTeamEntity).toHaveBeenCalledWith(
        testTeamEntity1.id,
        testBaseCreateTeamDto1.name,
        testBaseCreateTeamDto1.slug,
        testBaseCreateTeamDto1.upToDateDuration,
        testOrgMemberEntity1,
      );
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testTeamEntity1);
    });

    it('should create a new team', async () => {
      await expect(
        service.create(testBaseCreateTeamDto1, testOrgMemberEntity1),
      ).resolves.toEqual(testTeamEntity1);
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.addDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        testTeamDocParams1,
      );
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testBaseCreateTeamDto1, testOrgMemberEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if slug already exists', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(
        service.create(testBaseCreateTeamDto1, testOrgMemberEntity1),
      ).rejects.toThrow(new BadRequestException(teamSlugTakenBadRequest));
    });

    it('should throw an InternalServerErrorException and delete if addDocs throws an error', async () => {
      jest.spyOn(solrCli, 'addDocs').mockRejectedValue(new Error('addDocs'));
      await expect(
        service.create(testBaseCreateTeamDto1, testOrgMemberEntity1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(solrCli.addDocs).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testTeamEntity1);
    });
  });

  describe('hasOneBySlug', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(TeamEntity, {
        organization: testOrganizationEntity1,
        slug: testTeamEntity1.slug,
      });
    });

    it(`should say a team exists if it's found`, async () => {
      await expect(
        service.hasOneBySlug(testOrganizationEntity1, testTeamEntity1.slug),
      ).resolves.toBeTruthy();
    });

    it(`should say a team does not exist if it can't be found`, async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.hasOneBySlug(testOrganizationEntity1, testTeamEntity1.slug),
      ).resolves.toBeFalsy();
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.hasOneBySlug(testOrganizationEntity1, testTeamEntity1.slug),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneBySlug', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(TeamEntity, {
        organization: testOrganizationEntity1,
        slug: testTeamEntity1.slug,
      });
    });

    it('should find a team by slug', async () => {
      await expect(
        service.findOneBySlug(testOrganizationEntity1, testTeamEntity1.slug),
      ).resolves.toEqual(testTeamEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneBySlug(testOrganizationEntity1, testTeamEntity1.slug),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if slug does not exist', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneBySlug(testOrganizationEntity1, testTeamEntity1.slug),
      ).rejects.toThrow(new NotFoundException(teamSlugNotFound));
    });
  });

  describe('findOneById', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(
        TeamEntity,
        testTeamEntity1.id,
      );
    });

    it('should find a team by ID', async () => {
      await expect(service.findOneById(testTeamEntity1.id)).resolves.toEqual(
        testTeamEntity1,
      );
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(service.findOneById(testTeamEntity1.id)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.spyOn(service, 'changeUpToDateDuration').mockResolvedValueOnce({
        docs: [testDocEntity1],
        qnas: [testQnaEntity1],
      });
    });

    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(
        testTeamEntity1,
        testBaseUpdateTeamDto1,
      );
      expect(service.changeUpToDateDuration).toHaveBeenCalledTimes(1);
      expect(service.changeUpToDateDuration).toHaveBeenCalledWith(
        testTeamEntity1,
        testBaseUpdateTeamDto1.upToDateDuration,
      );
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it('should update a team', async () => {
      await expect(
        service.update(testTeamEntity1, testBaseUpdateTeamDto1),
      ).resolves.toEqual(testUpdatedTeam);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        [testUpdatedTeamDocParams, testDocDocParams1, testQnaDocParams1],
      );
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testTeamEntity1, testBaseUpdateTeamDto1),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if slug is already taken', async () => {
      jest
        .spyOn(em, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush')),
        );
      await expect(
        service.update(testTeamEntity1, testBaseUpdateTeamDto1),
      ).rejects.toThrow(new BadRequestException(teamSlugTakenBadRequest));
    });

    it('should not throw if getVersionAndReplaceDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'getVersionAndReplaceDocs')
        .mockRejectedValue(new Error('getVersionAndReplaceDocs'));
      await expect(
        service.update(testTeamEntity1, testBaseUpdateTeamDto1),
      ).resolves.toEqual(testUpdatedTeam);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        [testUpdatedTeamDocParams, testDocDocParams1, testQnaDocParams1],
      );
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(testTeamEntity1);
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testTeamEntity1);
    });

    it('should delete a team', async () => {
      await expect(service.delete(testTeamEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
      expect(solrCli.deleteDocs).toHaveBeenCalledWith(
        testOrganizationEntity1.id,
        [{ id: testTeamEntity1.id }, { query: `team:${testTeamEntity1.id}` }],
      );
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testTeamEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });

    it('should not throw if deleteDocs throws an error', async () => {
      jest
        .spyOn(solrCli, 'deleteDocs')
        .mockRejectedValue(new Error('deleteDocs'));
      await expect(service.delete(testTeamEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeUpToDateDuration', () => {
    const newDurationStr = 'P1Y';
    const newDuration = dayjs.duration(newDurationStr);

    beforeEach(() => {
      jest
        .spyOn(em, 'find')
        .mockResolvedValueOnce([testDocEntity1])
        .mockResolvedValueOnce([testQnaEntity1]);
    });

    afterEach(() => {
      expect(em.find).toHaveBeenCalledWith(DocEntity, {
        team: testTeamEntity1,
        upToDateDuration: null,
      });
    });

    it('should find all child posts and update their expirations', async () => {
      await expect(
        service.changeUpToDateDuration(testTeamEntity1, newDurationStr),
      ).resolves.toEqual({ docs: [testDocEntity1], qnas: [testQnaEntity1] });

      expect(em.find).toHaveBeenCalledTimes(2);
      expect(em.find).toHaveBeenCalledWith(QnaEntity, {
        team: testTeamEntity1,
        upToDateDuration: null,
      });
      expect(em.assign).toHaveBeenCalledTimes(2);
      expect(em.assign).toHaveBeenCalledWith(testDocEntity1, {
        outOfDateAt: dayjs(testDocEntity1.markedUpToDateAt)
          .add(newDuration)
          .toDate(),
      });
      expect(em.assign).toHaveBeenCalledWith(testQnaEntity1, {
        outOfDateAt: dayjs(testQnaEntity1.markedUpToDateAt)
          .add(newDuration)
          .toDate(),
      });
    });

    it('should throw an InternalServerErrorException if find throws an error', async () => {
      jest.spyOn(em, 'find').mockReset().mockRejectedValue(new Error('find'));
      await expect(
        service.changeUpToDateDuration(testTeamEntity1, newDurationStr),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
      expect(em.find).toHaveBeenCalledTimes(1);
    });
  });
});
