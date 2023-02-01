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
  TeamMemberEntity,
  testOrgMemberEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
} from '@newbee/api/shared/data-access';
import { TeamRole } from '@newbee/api/shared/util';
import {
  internalServerError,
  teamMemberNotFound,
  userAlreadyTeamMemberBadRequest,
} from '@newbee/shared/util';
import { TeamMemberService } from './team-member.service';

jest.mock('@newbee/api/shared/data-access', () => ({
  __esModule: true,
  ...jest.requireActual('@newbee/api/shared/data-access'),
  TeamMemberEntity: jest.fn(),
}));
const mockTeamMemberEntity = TeamMemberEntity as jest.Mock;

describe('TeamMemberService', () => {
  let service: TeamMemberService;
  let repository: EntityRepository<TeamMemberEntity>;

  const testUpdatedTeamMember = {
    ...testTeamMemberEntity1,
    role: TeamRole.Moderator,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamMemberService,
        {
          provide: getRepositoryToken(TeamMemberEntity),
          useValue: createMock<EntityRepository<TeamMemberEntity>>({
            findOneOrFail: jest.fn().mockResolvedValue(testTeamMemberEntity1),
            assign: jest.fn().mockResolvedValue(testUpdatedTeamMember),
          }),
        },
      ],
    }).compile();

    service = module.get<TeamMemberService>(TeamMemberService);
    repository = module.get<EntityRepository<TeamMemberEntity>>(
      getRepositoryToken(TeamMemberEntity)
    );

    jest.clearAllMocks();
    mockTeamMemberEntity.mockReturnValue(testTeamMemberEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockTeamMemberEntity).toBeCalledTimes(1);
      expect(mockTeamMemberEntity).toBeCalledWith(
        testOrgMemberEntity1,
        testTeamEntity1,
        testTeamMemberEntity1.role
      );
      expect(repository.persistAndFlush).toBeCalledTimes(1);
      expect(repository.persistAndFlush).toBeCalledWith(testTeamMemberEntity1);
    });

    it('should create a new team member', async () => {
      await expect(
        service.create(
          testOrgMemberEntity1,
          testTeamEntity1,
          testTeamMemberEntity1.role
        )
      ).resolves.toEqual(testTeamMemberEntity1);
    });

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(
          testOrgMemberEntity1,
          testTeamEntity1,
          testTeamMemberEntity1.role
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a BadRequestException if user is already in the team', async () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush'))
        );
      await expect(
        service.create(
          testOrgMemberEntity1,
          testTeamEntity1,
          testTeamMemberEntity1.role
        )
      ).rejects.toThrow(
        new BadRequestException(userAlreadyTeamMemberBadRequest)
      );
    });
  });

  describe('findOneByOrgMemberAndTeam', () => {
    afterEach(() => {
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledWith({
        orgMember: testOrgMemberEntity1,
        team: testTeamEntity1,
      });
    });

    it('should find a user organization', async () => {
      await expect(
        service.findOneByOrgMemberAndTeam(testOrgMemberEntity1, testTeamEntity1)
      ).resolves.toEqual(testTeamMemberEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByOrgMemberAndTeam(testOrgMemberEntity1, testTeamEntity1)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if org member does not exist in the team', async () => {
      jest
        .spyOn(repository, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByOrgMemberAndTeam(testOrgMemberEntity1, testTeamEntity1)
      ).rejects.toThrow(new NotFoundException(teamMemberNotFound));
    });
  });

  describe('updateRole', () => {
    it(`should update an org member's role`, async () => {
      await expect(
        service.updateRole(testTeamMemberEntity1, testUpdatedTeamMember.role)
      ).resolves.toEqual(testUpdatedTeamMember);
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testTeamMemberEntity1, {
        role: testUpdatedTeamMember.role,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a team member', async () => {
      await expect(
        service.delete(testTeamMemberEntity1)
      ).resolves.toBeUndefined();
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testTeamMemberEntity1);
    });
  });
});
