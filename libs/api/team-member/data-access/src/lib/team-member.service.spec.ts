import { createMock } from '@golevelup/ts-jest';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
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
  OrgRoleEnum,
  TeamRoleEnum,
  forbiddenError,
  teamMemberNotFound,
  testUpdateTeamMemberDto1,
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
  let em: EntityManager;
  let entityService: EntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamMemberService,
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>({
            findOne: jest.fn().mockResolvedValue(testTeamMemberEntity1),
            findOneOrFail: jest.fn().mockResolvedValue(testTeamMemberEntity1),
            find: jest.fn().mockResolvedValue([testTeamMemberEntity1]),
            assign: jest.fn().mockResolvedValue(testTeamMemberEntity1),
          }),
        },
        {
          provide: EntityService,
          useValue: createMock<EntityService>(),
        },
      ],
    }).compile();

    service = module.get(TeamMemberService);
    em = module.get(EntityManager);
    entityService = module.get(EntityService);

    jest.clearAllMocks();
    mockTeamMemberEntity.mockReturnValue(testTeamMemberEntity1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(entityService).toBeDefined();
  });

  describe('create', () => {
    afterEach(() => {
      expect(mockTeamMemberEntity).toHaveBeenCalledTimes(1);
      expect(mockTeamMemberEntity).toHaveBeenCalledWith(
        testOrgMemberEntity1,
        testTeamEntity1,
        testTeamMemberEntity1.role,
      );
      expect(em.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(em.persistAndFlush).toHaveBeenCalledWith(testTeamMemberEntity1);
    });

    it('should create a new team member', async () => {
      await expect(
        service.create(
          testOrgMemberEntity1,
          testTeamEntity1,
          testTeamMemberEntity1.role,
          OrgRoleEnum.Owner,
          null,
        ),
      ).resolves.toEqual(testTeamMemberEntity1);
    });

    it('should throw a BadRequestException if user is already in the team', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(
          new UniqueConstraintViolationException(new Error('persistAndFlush')),
        );
      await expect(
        service.create(
          testOrgMemberEntity1,
          testTeamEntity1,
          testTeamMemberEntity1.role,
          OrgRoleEnum.Owner,
          null,
        ),
      ).rejects.toThrow(
        new BadRequestException(userAlreadyTeamMemberBadRequest),
      );
    });
  });

  describe('findOneByTeamAndOrgMember', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(TeamMemberEntity, {
        orgMember: testOrgMemberEntity1,
        team: testTeamEntity1,
      });
    });

    it('should find a team member', async () => {
      await expect(
        service.findOneByTeamAndOrgMember(
          testOrgMemberEntity1,
          testTeamEntity1,
        ),
      ).resolves.toEqual(testTeamMemberEntity1);
    });

    it('should throw a NotFoundException if org member does not exist in the team', async () => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
      await expect(
        service.findOneByTeamAndOrgMember(
          testOrgMemberEntity1,
          testTeamEntity1,
        ),
      ).rejects.toThrow(new NotFoundException(teamMemberNotFound));
    });
  });

  describe('findOneByTeamAndOrgMemberOrNull', () => {
    it('should find a team member', async () => {
      await expect(
        service.findOneByTeamAndOrgMemberOrNull(
          testOrgMemberEntity1,
          testTeamEntity1,
        ),
      ).resolves.toEqual(testTeamMemberEntity1);
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(TeamMemberEntity, {
        orgMember: testOrgMemberEntity1,
        team: testTeamEntity1,
      });
    });
  });

  describe('updateRole', () => {
    it(`should update an org member's role`, async () => {
      await expect(
        service.updateRole(
          testTeamMemberEntity1,
          testUpdateTeamMemberDto1.role,
          OrgRoleEnum.Owner,
          null,
        ),
      ).resolves.toEqual(testTeamMemberEntity1);
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testTeamMemberEntity1, {
        role: testUpdateTeamMemberDto1.role,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a team member', async () => {
      await expect(
        service.delete(testTeamMemberEntity1, OrgRoleEnum.Owner, null),
      ).resolves.toBeUndefined();
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(
        testTeamMemberEntity1,
      );
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testTeamMemberEntity1);
    });
  });

  describe('checkRequesterTeamRole', () => {
    it('should pass if the org role is moderator or higher', () => {
      expect(
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Owner,
          null,
          TeamRoleEnum.Owner,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Moderator,
          null,
          TeamRoleEnum.Owner,
        ),
      ).toBeUndefined();
    });

    it('should fail if the org role is too low and team role is null', () => {
      expect(() =>
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          null,
          TeamRoleEnum.Owner,
        ),
      ).toThrow(new ForbiddenException(forbiddenError));
    });

    it(`should pass if the requester's team role is greater than or equal to the subject's team role`, () => {
      expect(
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          TeamRoleEnum.Member,
          TeamRoleEnum.Member,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Member,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Moderator,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          TeamRoleEnum.Owner,
          TeamRoleEnum.Member,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          TeamRoleEnum.Owner,
          TeamRoleEnum.Moderator,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          TeamRoleEnum.Owner,
          TeamRoleEnum.Owner,
        ),
      ).toBeUndefined();
    });

    it(`should fail if the requester's team role is lower than the subject's team role`, () => {
      expect(() =>
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          TeamRoleEnum.Member,
          TeamRoleEnum.Moderator,
        ),
      ).toThrow(new ForbiddenException(forbiddenError));
      expect(() =>
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          TeamRoleEnum.Member,
          TeamRoleEnum.Owner,
        ),
      ).toThrow(new ForbiddenException(forbiddenError));
      expect(() =>
        TeamMemberService.checkRequesterTeamRole(
          OrgRoleEnum.Member,
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Owner,
        ),
      ).toThrow(new ForbiddenException(forbiddenError));
    });
  });
});
