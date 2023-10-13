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
  EntityService,
  TeamEntity,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testTeamDocParams1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import { TeamDocParams } from '@newbee/api/shared/util';
import {
  testBaseCreateTeamDto1,
  testBaseUpdateTeamDto1,
} from '@newbee/shared/data-access';
import {
  internalServerError,
  teamSlugNotFound,
  teamSlugTakenBadRequest,
} from '@newbee/shared/util';
import { SolrCli } from '@newbee/solr-cli';
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
  const testUpdatedTeamDocParams: TeamDocParams = {
    ...testTeamDocParams1,
    slug: testUpdatedTeam.slug,
    team_name: testUpdatedTeam.name,
  };

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
          useValue: createMock<EntityService>({
            createTeamDocParams: jest.fn().mockReturnValue(testTeamDocParams1),
          }),
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
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockTeamEntity).toBeCalledTimes(1);
      expect(mockTeamEntity).toBeCalledWith(
        testTeamEntity1.id,
        testBaseCreateTeamDto1.name,
        testBaseCreateTeamDto1.slug,
        testOrgMemberEntity1,
      );
      expect(em.persistAndFlush).toBeCalledTimes(1);
      expect(em.persistAndFlush).toBeCalledWith(testTeamEntity1);
    });

    it('should create a new team', async () => {
      await expect(
        service.create(testBaseCreateTeamDto1, testOrgMemberEntity1),
      ).resolves.toEqual(testTeamEntity1);
      expect(solrCli.addDocs).toBeCalledTimes(1);
      expect(solrCli.addDocs).toBeCalledWith(
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
      expect(solrCli.addDocs).toBeCalledTimes(1);
      expect(em.removeAndFlush).toBeCalledTimes(1);
      expect(em.removeAndFlush).toBeCalledWith(testTeamEntity1);
    });
  });

  describe('hasOneBySlug', () => {
    afterEach(() => {
      expect(em.findOne).toBeCalledTimes(1);
      expect(em.findOne).toBeCalledWith(TeamEntity, {
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
      expect(em.findOneOrFail).toBeCalledTimes(1);
      expect(em.findOneOrFail).toBeCalledWith(TeamEntity, {
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

  describe('update', () => {
    beforeEach(() => {
      jest
        .spyOn(entityService, 'createTeamDocParams')
        .mockReturnValue(testUpdatedTeamDocParams);
    });

    afterEach(() => {
      expect(em.assign).toBeCalledTimes(1);
      expect(em.assign).toBeCalledWith(testTeamEntity1, testBaseUpdateTeamDto1);
      expect(em.flush).toBeCalledTimes(1);
    });

    it('should update a team', async () => {
      await expect(
        service.update(testTeamEntity1, testBaseUpdateTeamDto1),
      ).resolves.toEqual(testUpdatedTeam);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1.id,
        testUpdatedTeamDocParams,
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
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledTimes(1);
      expect(solrCli.getVersionAndReplaceDocs).toBeCalledWith(
        testOrganizationEntity1.id,
        testUpdatedTeamDocParams,
      );
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toBeCalledTimes(1);
      expect(entityService.safeToDelete).toBeCalledWith(testTeamEntity1);
      expect(em.removeAndFlush).toBeCalledTimes(1);
      expect(em.removeAndFlush).toBeCalledWith(testTeamEntity1);
    });

    it('should delete a team', async () => {
      await expect(service.delete(testTeamEntity1)).resolves.toBeUndefined();
      expect(solrCli.deleteDocs).toBeCalledTimes(1);
      expect(solrCli.deleteDocs).toBeCalledWith(testOrganizationEntity1.id, [
        { id: testTeamEntity1.id },
        { query: `team:${testTeamEntity1.id}` },
      ]);
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
      expect(solrCli.deleteDocs).toBeCalledTimes(1);
    });
  });
});
