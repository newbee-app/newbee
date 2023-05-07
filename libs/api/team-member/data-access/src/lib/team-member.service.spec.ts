import { createMock } from '@golevelup/ts-jest';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EntityService,
  TeamMemberEntity,
  testOrgMemberEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
} from '@newbee/api/shared/data-access';
import {
  forbiddenError,
  internalServerError,
  OrgRoleEnum,
  teamMemberNotFound,
  TeamRoleEnum,
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
  let entityService: EntityService;

  const testUpdatedTeamMember = {
    ...testTeamMemberEntity1,
    role: TeamRoleEnum.Moderator,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamMemberService,
        {
          provide: getRepositoryToken(TeamMemberEntity),
          useValue: createMock<EntityRepository<TeamMemberEntity>>({
            findOne: jest.fn().mockResolvedValue(testTeamMemberEntity1),
            findOneOrFail: jest.fn().mockResolvedValue(testTeamMemberEntity1),
            find: jest.fn().mockResolvedValue([testTeamMemberEntity1]),
            assign: jest.fn().mockResolvedValue(testUpdatedTeamMember),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
        },
      ],
    }).compile();

    service = module.get<TeamMemberService>(TeamMemberService);
    repository = module.get<EntityRepository<TeamMemberEntity>>(
      getRepositoryToken(TeamMemberEntity)
    );
    entityService = module.get<EntityService>(EntityService);

    jest.clearAllMocks();
    mockTeamMemberEntity.mockReturnValue(testTeamMemberEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(entityService).toBeDefined();
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
          testTeamMemberEntity1.role,
          OrgRoleEnum.Owner,
          null
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
          testTeamMemberEntity1.role,
          OrgRoleEnum.Owner,
          null
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
          testTeamMemberEntity1.role,
          OrgRoleEnum.Owner,
          null
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

    it('should find a team member', async () => {
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

  describe('findOneByOrgMemberAndTeamOrNull', () => {
    afterEach(() => {
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledWith({
        orgMember: testOrgMemberEntity1,
        team: testTeamEntity1,
      });
    });

    it('should find a team member', async () => {
      await expect(
        service.findOneByOrgMemberAndTeamOrNull(
          testOrgMemberEntity1,
          testTeamEntity1
        )
      ).resolves.toEqual(testTeamMemberEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneByOrgMemberAndTeamOrNull(
          testOrgMemberEntity1,
          testTeamEntity1
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('updateRole', () => {
    afterEach(() => {
      expect(repository.assign).toBeCalledTimes(1);
      expect(repository.assign).toBeCalledWith(testTeamMemberEntity1, {
        role: testUpdatedTeamMember.role,
      });
      expect(repository.flush).toBeCalledTimes(1);
    });

    it(`should update an org member's role`, async () => {
      await expect(
        service.updateRole(
          testTeamMemberEntity1,
          testUpdatedTeamMember.role,
          OrgRoleEnum.Owner,
          null
        )
      ).resolves.toEqual(testUpdatedTeamMember);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(repository, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.updateRole(
          testTeamMemberEntity1,
          testUpdatedTeamMember.role,
          OrgRoleEnum.Owner,
          null
        )
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.prepareToDelete).toBeCalledTimes(1);
      expect(entityService.prepareToDelete).toBeCalledWith(
        testTeamMemberEntity1
      );
      expect(repository.removeAndFlush).toBeCalledTimes(1);
      expect(repository.removeAndFlush).toBeCalledWith(testTeamMemberEntity1);
    });

    it('should delete a team member', async () => {
      await expect(
        service.delete(testTeamMemberEntity1, OrgRoleEnum.Owner, null)
      ).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(repository, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(
        service.delete(testTeamMemberEntity1, OrgRoleEnum.Owner, null)
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('checkRequester', () => {
    it('should pass if the org role is moderator or higher', () => {
      expect(
        service.checkRequester(OrgRoleEnum.Owner, null, TeamRoleEnum.Owner)
      ).toBeUndefined();
      expect(
        service.checkRequester(OrgRoleEnum.Moderator, null, TeamRoleEnum.Owner)
      ).toBeUndefined();
    });

    it('should fail if the org role is too low and team role is null', () => {
      expect(() =>
        service.checkRequester(OrgRoleEnum.Member, null, TeamRoleEnum.Owner)
      ).toThrow(new ForbiddenException(forbiddenError));
    });

    it(`should pass if the requester's team role is greater than or equal to the subject's team role`, () => {
      expect(
        service.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Member,
          TeamRoleEnum.Member
        )
      ).toBeUndefined();
      expect(
        service.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Member
        )
      ).toBeUndefined();
      expect(
        service.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Moderator
        )
      ).toBeUndefined();
      expect(
        service.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Owner,
          TeamRoleEnum.Member
        )
      ).toBeUndefined();
      expect(
        service.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Owner,
          TeamRoleEnum.Moderator
        )
      ).toBeUndefined();
      expect(
        service.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Owner,
          TeamRoleEnum.Owner
        )
      ).toBeUndefined();
    });

    it(`should fail if the requester's team role is lower than the subject's team role`, () => {
      expect(() =>
        service.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Member,
          TeamRoleEnum.Moderator
        )
      ).toThrow(new ForbiddenException(forbiddenError));
      expect(() =>
        service.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Member,
          TeamRoleEnum.Owner
        )
      ).toThrow(new ForbiddenException(forbiddenError));
      expect(() =>
        service.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Owner
        )
      ).toThrow(new ForbiddenException(forbiddenError));
    });
  });
});
