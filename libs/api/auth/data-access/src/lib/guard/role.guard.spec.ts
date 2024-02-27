import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { DocService } from '@newbee/api/doc/data-access';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { QnaService } from '@newbee/api/qna/data-access';
import {
  DocEntity,
  OrgMemberEntity,
  QnaEntity,
  TeamMemberEntity,
  testDocEntity1,
  testOrgMemberEntity1,
  testOrganizationEntity1,
  testQnaEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
  testUserEntity1,
  testUserEntity2,
} from '@newbee/api/shared/data-access';
import {
  ROLE_KEY,
  docKey,
  orgMemberKey,
  organizationKey,
  qnaKey,
  subjectOrgMemberKey,
  subjectTeamMemberKey,
  teamKey,
  teamMemberKey,
} from '@newbee/api/shared/util';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import {
  ConditionalRoleEnum,
  Keyword,
  OrgRoleEnum,
  PostRoleEnum,
  TeamRoleEnum,
  UserRoleEnum,
  docWithoutOrgBadRequest,
  qnaWithoutOrgBadRequest,
  teamWithoutOrgBadRequest,
  unauthorizedError,
} from '@newbee/shared/util';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let reflector: Reflector;
  let em: EntityManager;
  let organizationService: OrganizationService;
  let orgMemberService: OrgMemberService;
  let teamService: TeamService;
  let teamMemberService: TeamMemberService;
  let docService: DocService;
  let qnaService: QnaService;
  let guard: RoleGuard;
  let context: ExecutionContext;

  const baseParams = {
    [Keyword.Organization]: testOrganizationEntity1.slug,
  };
  const baseRequest = {
    [Keyword.User]: testUserEntity1,
    params: baseParams,
  };

  beforeEach(() => {
    reflector = createMock<Reflector>({
      getAllAndOverride: jest.fn().mockReturnValue([]),
    });
    em = createMock<EntityManager>();
    organizationService = createMock<OrganizationService>({
      findOneBySlug: jest.fn().mockResolvedValue(testOrganizationEntity1),
    });
    orgMemberService = createMock<OrgMemberService>({
      findOneByOrgAndUserOrNull: jest
        .fn()
        .mockResolvedValue(testOrgMemberEntity1),
      findOneByOrgAndSlug: jest.fn().mockResolvedValue(testOrgMemberEntity1),
    });
    teamService = createMock<TeamService>({
      findOneByOrgAndSlug: jest.fn().mockResolvedValue(testTeamEntity1),
      findOneById: jest.fn().mockResolvedValue(testTeamEntity1),
    });
    teamMemberService = createMock<TeamMemberService>({
      findOneByTeamAndOrgMember: jest
        .fn()
        .mockResolvedValue(testTeamMemberEntity1),
      findOneByTeamAndOrgMemberOrNull: jest
        .fn()
        .mockResolvedValue(testTeamMemberEntity1),
    });
    docService = createMock<DocService>({
      findOneBySlug: jest.fn().mockResolvedValue(testDocEntity1),
    });
    qnaService = createMock<QnaService>({
      findOneBySlug: jest.fn().mockResolvedValue(testQnaEntity1),
    });

    guard = new RoleGuard(
      reflector,
      em,
      organizationService,
      orgMemberService,
      teamService,
      teamMemberService,
      docService,
      qnaService,
    );

    context = createMock<ExecutionContext>({
      switchToHttp: jest.fn().mockReturnValue(
        createMock<HttpArgumentsHost>({
          getRequest: jest.fn().mockReturnValue({
            ...baseRequest,
            params: {
              ...baseParams,
              [Keyword.Team]: testTeamEntity1.slug,
              [Keyword.Doc]: testDocEntity1.slug,
              [Keyword.Qna]: testQnaEntity1.slug,
              [Keyword.Member]: testOrgMemberEntity1.slug,
            },
          }),
        }),
      ),
    });
  });

  it('should be defined', () => {
    expect(reflector).toBeDefined();
    expect(em).toBeDefined();
    expect(organizationService).toBeDefined();
    expect(orgMemberService).toBeDefined();
    expect(teamService).toBeDefined();
    expect(teamMemberService).toBeDefined();
    expect(docService).toBeDefined();
    expect(qnaService).toBeDefined();
    expect(guard).toBeDefined();
    expect(context).toBeDefined();
  });

  describe('error checks', () => {
    afterEach(() => {
      expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(context.switchToHttp().getRequest).toHaveBeenCalledTimes(1);
    });

    it('should throw an UnauthorizedException if roles are specified and user is not', async () => {
      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ params: {} });
      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException(unauthorizedError),
      );
    });

    it('should throw a BadRequestException if team slug is specified and org is not', async () => {
      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
        ...baseRequest,
        params: { [Keyword.Team]: testTeamEntity1.slug },
      });
      await expect(guard.canActivate(context)).rejects.toThrow(
        new BadRequestException(teamWithoutOrgBadRequest),
      );
    });

    it('should throw a BadRequestException if doc slug is specified and org is not', async () => {
      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
        ...baseRequest,
        params: { [Keyword.Doc]: testDocEntity1.slug },
      });
      await expect(guard.canActivate(context)).rejects.toThrow(
        new BadRequestException(docWithoutOrgBadRequest),
      );
    });

    it('should throw a BadRequestException if qna slug is specified and org is not', async () => {
      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
        ...baseRequest,
        params: { [Keyword.Qna]: testQnaEntity1.slug },
      });
      await expect(guard.canActivate(context)).rejects.toThrow(
        new BadRequestException(qnaWithoutOrgBadRequest),
      );
    });
  });

  describe('user checks', () => {
    it(`should return true if roles contains user's role`, async () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRoleEnum.Admin]);
      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ ...baseRequest, params: {} });
      await expect(guard.canActivate(context)).resolves.toBeTruthy();

      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ [Keyword.User]: testUserEntity2, params: {} });
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });
  });

  describe('org role checks', () => {
    const member = {
      ...testOrgMemberEntity1,
      role: OrgRoleEnum.Member,
    } as OrgMemberEntity;
    const moderator = {
      ...testOrgMemberEntity1,
      role: OrgRoleEnum.Moderator,
    } as OrgMemberEntity;

    afterEach(() => {
      expect(organizationService.findOneBySlug).toHaveBeenCalledWith(
        testOrganizationEntity1.slug,
      );
      expect(context.switchToHttp().getRequest()[organizationKey]).toEqual(
        testOrganizationEntity1,
      );
      expect(orgMemberService.findOneByOrgAndUserOrNull).toHaveBeenCalledWith(
        testUserEntity1,
        testOrganizationEntity1,
      );
    });

    it(`should return true if roles contains org member's role`, async () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([OrgRoleEnum.Owner]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(context.switchToHttp().getRequest()[orgMemberKey]).toEqual(
        testOrgMemberEntity1,
      );

      jest
        .spyOn(orgMemberService, 'findOneByOrgAndUserOrNull')
        .mockResolvedValue(moderator);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
      expect(context.switchToHttp().getRequest()[orgMemberKey]).toEqual(
        moderator,
      );
    });

    it('should account for OrgMemberIfNoTeam', async () => {
      jest
        .spyOn(orgMemberService, 'findOneByOrgAndUserOrNull')
        .mockResolvedValue(member);
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([ConditionalRoleEnum.OrgMemberIfNoTeam]);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ ...baseRequest, params: baseParams });
      await expect(guard.canActivate(context)).resolves.toBeTruthy();

      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
        ...baseRequest,
        params: { ...baseParams, [Keyword.Team]: testTeamEntity1.slug },
      });
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
        ...baseRequest,
        params: { ...baseParams, [Keyword.Doc]: testDocEntity1.slug },
      });
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
        ...baseRequest,
        params: { ...baseParams, [Keyword.Qna]: testQnaEntity1.slug },
      });
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });

    it('should account for OrgRoleGteSubject', async () => {
      jest
        .spyOn(orgMemberService, 'findOneByOrgAndUserOrNull')
        .mockResolvedValue(moderator);
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([
          OrgRoleEnum.Moderator,
          OrgRoleEnum.Owner,
          ConditionalRoleEnum.OrgRoleGteSubject,
        ]);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(orgMemberService, 'findOneByOrgAndSlug')
        .mockResolvedValue(moderator);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(orgMemberService.findOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testOrgMemberEntity1.slug,
      );
      expect(context.switchToHttp().getRequest()[subjectOrgMemberKey]).toEqual(
        moderator,
      );
    });
  });

  describe('team role checks', () => {
    const member: TeamMemberEntity = {
      ...testTeamMemberEntity1,
      role: TeamRoleEnum.Member,
    };
    const moderator: TeamMemberEntity = {
      ...testTeamMemberEntity1,
      role: TeamRoleEnum.Moderator,
    };

    beforeEach(() => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([TeamRoleEnum.Moderator, TeamRoleEnum.Owner]);
    });

    afterEach(() => {
      expect(teamService.findOneByOrgAndSlug).toHaveBeenCalledWith(
        testOrganizationEntity1,
        testTeamEntity1.slug,
      );
      expect(context.switchToHttp().getRequest()[teamKey]).toEqual(
        testTeamEntity1,
      );

      expect(
        teamMemberService.findOneByTeamAndOrgMemberOrNull,
      ).toHaveBeenCalledWith(testOrgMemberEntity1, testTeamEntity1);

      expect(teamMemberService.findOneByTeamAndOrgMember).toHaveBeenCalledWith(
        testOrgMemberEntity1,
        testTeamEntity1,
      );
    });

    it(`should return true if roles contains team member's role`, async () => {
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(context.switchToHttp().getRequest()[teamMemberKey]).toEqual(
        testTeamMemberEntity1,
      );

      jest
        .spyOn(teamMemberService, 'findOneByTeamAndOrgMemberOrNull')
        .mockResolvedValue(null);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(teamMemberService, 'findOneByTeamAndOrgMemberOrNull')
        .mockResolvedValue(member);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });

    it('should account for post teams', async () => {
      jest
        .spyOn(teamMemberService, 'findOneByTeamAndOrgMemberOrNull')
        .mockResolvedValueOnce(testTeamMemberEntity1)
        .mockResolvedValueOnce(member)
        .mockResolvedValue(member);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(teamMemberService, 'findOneByTeamAndOrgMemberOrNull')
        .mockResolvedValueOnce(testTeamMemberEntity1)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });

    it('should account for TeamRoleGteSubject', async () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Owner,
          ConditionalRoleEnum.TeamRoleGteSubject,
        ]);
      jest
        .spyOn(teamMemberService, 'findOneByTeamAndOrgMemberOrNull')
        .mockResolvedValue(moderator);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(teamMemberService, 'findOneByTeamAndOrgMember')
        .mockResolvedValue(moderator);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(context.switchToHttp().getRequest()[teamMemberKey]).toEqual(
        moderator,
      );
      expect(context.switchToHttp().getRequest()[subjectTeamMemberKey]).toEqual(
        moderator,
      );
    });
  });

  describe('doc role check', () => {
    beforeEach(() => {
      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
        ...baseRequest,
        params: {
          ...baseParams,
          [Keyword.Team]: testTeamEntity1.slug,
          [Keyword.Doc]: testDocEntity1.slug,
        },
      });
    });

    afterEach(() => {
      expect(docService.findOneBySlug).toHaveBeenCalledWith(
        testDocEntity1.slug,
      );
    });

    it('should return true if roles contains post role', async () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([PostRoleEnum.Maintainer]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(context.switchToHttp().getRequest()[docKey]).toEqual(
        testDocEntity1,
      );

      jest.spyOn(docService, 'findOneBySlug').mockResolvedValue({
        ...testDocEntity1,
        maintainer: null,
      } as DocEntity);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([PostRoleEnum.Creator]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();

      jest
        .spyOn(docService, 'findOneBySlug')
        .mockResolvedValue({ ...testDocEntity1, creator: null } as DocEntity);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });
  });

  describe('qna role check', () => {
    beforeEach(() => {
      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
        ...baseRequest,
        params: {
          ...baseParams,
          [Keyword.Team]: testTeamEntity1.slug,
          [Keyword.Qna]: testQnaEntity1.slug,
        },
      });
    });

    afterEach(() => {
      expect(qnaService.findOneBySlug).toHaveBeenCalledWith(
        testQnaEntity1.slug,
      );
    });

    it('should return true if roles contains post role', async () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([PostRoleEnum.Maintainer]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(context.switchToHttp().getRequest()[qnaKey]).toEqual(
        testQnaEntity1,
      );

      jest.spyOn(qnaService, 'findOneBySlug').mockResolvedValue({
        ...testQnaEntity1,
        maintainer: null,
      } as QnaEntity);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([PostRoleEnum.Creator]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();

      jest
        .spyOn(qnaService, 'findOneBySlug')
        .mockResolvedValue({ ...testQnaEntity1, creator: null } as QnaEntity);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });
  });
});
