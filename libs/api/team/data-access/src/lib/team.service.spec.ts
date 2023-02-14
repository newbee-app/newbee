import { createMock } from '@golevelup/ts-jest';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  TeamEntity,
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testTeamEntity1,
} from '@newbee/api/shared/data-access';
import {
  testBaseCreateTeamDto1,
  testBaseUpdateTeamDto1,
} from '@newbee/shared/data-access';
import {
  internalServerError,
  teamSlugNotFound,
  teamSlugTakenBadRequest,
} from '@newbee/shared/util';
import { TeamService } from './team.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  TeamEntity: jest.fn(),
}));
const mockTeamEntity = TeamEntity as jest.Mock;

describe('TeamService', () => {
  let service: TeamService;
  let repository: EntityRepository<TeamEntity>;

  const testUpdatedTeam = { ...testTeamEntity1, ...testBaseUpdateTeamDto1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(TeamEntity),
          useValue: createMock<EntityRepository<TeamEntity>>({
            findOne: jest.fn().mockResolvedValue(testTeamEntity1),
            findOneOrFail: jest.fn().mockResolvedValue(testTeamEntity1),
            assign: jest.fn().mockReturnValue(testUpdatedTeam),
          }),
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    repository = module.get<EntityRepository<TeamEntity>>(
      getRepositoryToken(TeamEntity)
    );

    jest.clearAllMocks();
    mockTeamEntity.mockReturnValue(testTeamEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockTeamEntity).toBeCalledTimes(1);
      expect(mockTeamEntity).toBeCalledWith(
        testBaseCreateTeamDto1.name,
        testBaseCreateTeamDto1.slug,
        testOrgMemberEntity1
      );
      expect(repository.persistAndFlush).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledWith(testTeamEntity1);
    });

    it('should create a new team', async () => {
      await expect(
        service.create(testBaseCreateTeamDto1, testOrgMemberEntity1)
      ).resolves.toEqual(testTeamEntity1);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(testBaseCreateTeamDto1, testOrgMemberEntity1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if slug already exists', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush'))
        );
      await expect(
        service.create(testBaseCreateTeamDto1, testOrgMemberEntity1)
      ).rejects.toThrow(new BadRequestException(teamSlugTakenBadRequest));
    });
  });

  describe('hasOneBySlug', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        organization: testOrganizationEntity1,
        slug: testTeamEntity1.slug,
      });
    });

    it(`should say a team exists if it's found`, async () => {
      await expect(
        service.hasOneBySlug(testOrganizationEntity1, testTeamEntity1.slug)
      ).resolves.toBeTruthy();
    });

    it(`should say a team does not exist if it can't be found`, async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(
        service.hasOneBySlug(testOrganizationEntity1, testTeamEntity1.slug)
      ).resolves.toBeFalsy();
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.hasOneBySlug(testOrganizationEntity1, testTeamEntity1.slug)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('findOneBySlug', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith({
        organization: testOrganizationEntity1,
        slug: testTeamEntity1.slug,
      });
    });

    it('should find a team by slug', async () => {
      await expect(
        service.findOneBySlug(testOrganizationEntity1, testTeamEntity1.slug)
      ).resolves.toEqual(testTeamEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneBySlug(testOrganizationEntity1, testTeamEntity1.slug)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if slug does not exist', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneBySlug(testOrganizationEntity1, testTeamEntity1.slug)
      ).rejects.toThrow(new NotFoundException(teamSlugNotFound));
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(
        testTeamEntity1,
        testBaseUpdateTeamDto1
      );
      expect(repository.flush).toBeCalledTimes(1);
    });

    it('should update a team', async () => {
      await expect(
        service.update(testTeamEntity1, testBaseUpdateTeamDto1)
      ).resolves.toEqual(testUpdatedTeam);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.update(testTeamEntity1, testBaseUpdateTeamDto1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if slug is already taken', async () => {
      jest
        .spyOn(repository, 'flush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('flush'))
        );
      await expect(
        service.update(testTeamEntity1, testBaseUpdateTeamDto1)
      ).rejects.toThrow(new BadRequestException(teamSlugTakenBadRequest));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testTeamEntity1);
    });

    it('should delete a team', async () => {
      await expect(service.delete(testTeamEntity1)).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testTeamEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError)
      );
    });
  });
});
