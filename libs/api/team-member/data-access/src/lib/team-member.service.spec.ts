import { createMock } from '@golevelup/ts-jest';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EntityService,
  OrgMemberEntity,
  TeamMemberEntity,
  testOrgMemberEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
} from '@newbee/api/shared/data-access';
import {
  OrgRoleEnum,
  TeamRoleEnum,
  forbiddenError,
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
  let em: EntityManager;
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
          provide: EntityManager,
          useValue: createMock<EntityManager>({
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
    em = module.get<EntityManager>(EntityManager);
    entityService = module.get<EntityService>(EntityService);

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

    it('should throw an InternalServerErrorException if persistAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'persistAndFlush')
        .mockRejectedValue(new Error('persistAndFlush'));
      await expect(
        service.create(
          testOrgMemberEntity1,
          testTeamEntity1,
          testTeamMemberEntity1.role,
          OrgRoleEnum.Owner,
          null,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
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

  describe('findOneByOrgMemberAndTeam', () => {
    afterEach(() => {
      expect(em.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(em.findOneOrFail).toHaveBeenCalledWith(TeamMemberEntity, {
        orgMember: testOrgMemberEntity1,
        team: testTeamEntity1,
      });
    });

    it('should find a team member', async () => {
      await expect(
        service.findOneByOrgMemberAndTeam(
          testOrgMemberEntity1,
          testTeamEntity1,
        ),
      ).resolves.toEqual(testTeamMemberEntity1);
    });

    it('should throw an InternalServerErrorException if findOneOrFail throws an error', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new Error('findOneOrFail'));
      await expect(
        service.findOneByOrgMemberAndTeam(
          testOrgMemberEntity1,
          testTeamEntity1,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });

    it('should throw a NotFoundException if org member does not exist in the team', async () => {
      jest
        .spyOn(em, 'findOneOrFail')
        .mockRejectedValue(new NotFoundError('findOneOrFail'));
      await expect(
        service.findOneByOrgMemberAndTeam(
          testOrgMemberEntity1,
          testTeamEntity1,
        ),
      ).rejects.toThrow(new NotFoundException(teamMemberNotFound));
    });
  });

  describe('findOneByOrgMemberAndTeamOrNull', () => {
    afterEach(() => {
      expect(em.findOne).toHaveBeenCalledTimes(1);
      expect(em.findOne).toHaveBeenCalledWith(TeamMemberEntity, {
        orgMember: testOrgMemberEntity1,
        team: testTeamEntity1,
      });
    });

    it('should find a team member', async () => {
      await expect(
        service.findOneByOrgMemberAndTeamOrNull(
          testOrgMemberEntity1,
          testTeamEntity1,
        ),
      ).resolves.toEqual(testTeamMemberEntity1);
    });

    it('should throw an InternalServerErrorException if findOne throws an error', async () => {
      jest.spyOn(em, 'findOne').mockRejectedValue(new Error('findOne'));
      await expect(
        service.findOneByOrgMemberAndTeamOrNull(
          testOrgMemberEntity1,
          testTeamEntity1,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('updateRole', () => {
    afterEach(() => {
      expect(em.assign).toHaveBeenCalledTimes(1);
      expect(em.assign).toHaveBeenCalledWith(testTeamMemberEntity1, {
        role: testUpdatedTeamMember.role,
      });
      expect(em.flush).toHaveBeenCalledTimes(1);
    });

    it(`should update an org member's role`, async () => {
      await expect(
        service.updateRole(
          testTeamMemberEntity1,
          testUpdatedTeamMember.role,
          OrgRoleEnum.Owner,
          null,
        ),
      ).resolves.toEqual(testUpdatedTeamMember);
    });

    it('should throw an InternalServerErrorException if flush throws an error', async () => {
      jest.spyOn(em, 'flush').mockRejectedValue(new Error('flush'));
      await expect(
        service.updateRole(
          testTeamMemberEntity1,
          testUpdatedTeamMember.role,
          OrgRoleEnum.Owner,
          null,
        ),
      ).rejects.toThrow(new InternalServerErrorException(internalServerError));
    });
  });

  describe('delete', () => {
    afterEach(() => {
      expect(entityService.safeToDelete).toHaveBeenCalledTimes(1);
      expect(entityService.safeToDelete).toHaveBeenCalledWith(
        testTeamMemberEntity1,
      );
      expect(em.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(em.removeAndFlush).toHaveBeenCalledWith(testTeamMemberEntity1);
    });

    it('should delete a team member', async () => {
      await expect(
        service.delete(testTeamMemberEntity1),
      ).resolves.toBeUndefined();
    });

    it('should throw an InternalServerErrorException if removeAndFlush throws an error', async () => {
      jest
        .spyOn(em, 'removeAndFlush')
        .mockRejectedValue(new Error('removeAndFlush'));
      await expect(service.delete(testTeamMemberEntity1)).rejects.toThrow(
        new InternalServerErrorException(internalServerError),
      );
    });
  });

  describe('checkRequester', () => {
    it('should pass if the org role is moderator or higher', () => {
      expect(
        TeamMemberService.checkRequester(
          OrgRoleEnum.Owner,
          null,
          TeamRoleEnum.Owner,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequester(
          OrgRoleEnum.Moderator,
          null,
          TeamRoleEnum.Owner,
        ),
      ).toBeUndefined();
    });

    it('should fail if the org role is too low and team role is null', () => {
      expect(() =>
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          null,
          TeamRoleEnum.Owner,
        ),
      ).toThrow(new ForbiddenException(forbiddenError));
    });

    it(`should pass if the requester's team role is greater than or equal to the subject's team role`, () => {
      expect(
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Member,
          TeamRoleEnum.Member,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Member,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Moderator,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Owner,
          TeamRoleEnum.Member,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Owner,
          TeamRoleEnum.Moderator,
        ),
      ).toBeUndefined();
      expect(
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Owner,
          TeamRoleEnum.Owner,
        ),
      ).toBeUndefined();
    });

    it(`should fail if the requester's team role is lower than the subject's team role`, () => {
      expect(() =>
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Member,
          TeamRoleEnum.Moderator,
        ),
      ).toThrow(new ForbiddenException(forbiddenError));
      expect(() =>
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Member,
          TeamRoleEnum.Owner,
        ),
      ).toThrow(new ForbiddenException(forbiddenError));
      expect(() =>
        TeamMemberService.checkRequester(
          OrgRoleEnum.Member,
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Owner,
        ),
      ).toThrow(new ForbiddenException(forbiddenError));
    });
  });

  describe('checkOrgMemberTeam', () => {
    const orgMember = {
      ...testOrgMemberEntity1,
      role: OrgRoleEnum.Member,
    } as OrgMemberEntity;

    beforeEach(() => {
      jest.spyOn(em, 'findOne').mockResolvedValue(null);
    });

    it('should pass if org role is >= moderator or team role is >= member', async () => {
      await expect(
        service.checkOrgMemberTeam(testOrgMemberEntity1, testTeamEntity1),
      ).resolves.toBeUndefined();
      await expect(
        service.checkOrgMemberTeam(
          {
            ...testOrgMemberEntity1,
            role: OrgRoleEnum.Moderator,
          } as OrgMemberEntity,
          testTeamEntity1,
        ),
      ).resolves.toBeUndefined();

      jest.spyOn(em, 'findOne').mockResolvedValue(testTeamMemberEntity1);
      await expect(
        service.checkOrgMemberTeam(orgMember, testTeamEntity1),
      ).resolves.toBeUndefined();
      jest.spyOn(em, 'findOne').mockResolvedValue({
        ...testTeamMemberEntity1,
        role: TeamRoleEnum.Moderator,
      });
      await expect(
        service.checkOrgMemberTeam(orgMember, testTeamEntity1),
      ).resolves.toBeUndefined();
      jest.spyOn(em, 'findOne').mockResolvedValue({
        ...testTeamMemberEntity1,
        role: TeamRoleEnum.Member,
      });
      await expect(
        service.checkOrgMemberTeam(orgMember, testTeamEntity1),
      ).resolves.toBeUndefined();
      expect(em.findOne).toHaveBeenCalledTimes(5);
    });

    it('should throw ForbiddenException if org role is member and team member is null', async () => {
      await expect(
        service.checkOrgMemberTeam(orgMember, testTeamEntity1),
      ).rejects.toThrow(new ForbiddenException(forbiddenError));
    });
  });
});
