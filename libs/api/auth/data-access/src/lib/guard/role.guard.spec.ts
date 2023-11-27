import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
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
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testQnaEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  ConditionalRoleEnum,
  docKey,
  organizationKey,
  orgMemberKey,
  PostRoleEnum,
  qnaKey,
  ROLE_KEY,
  subjectOrgMemberKey,
  subjectTeamMemberKey,
  teamKey,
  teamMemberKey,
} from '@newbee/api/shared/util';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import { Keyword, OrgRoleEnum, TeamRoleEnum } from '@newbee/shared/util';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let reflector: Reflector;
  let organizationService: OrganizationService;
  let orgMemberService: OrgMemberService;
  let teamService: TeamService;
  let teamMemberService: TeamMemberService;
  let docService: DocService;
  let qnaService: QnaService;
  let context: ExecutionContext;

  const baseParams = {
    [Keyword.Organization]: testOrganizationEntity1.slug,
  };
  const baseRequest = {
    [Keyword.User]: testUserEntity1,
    params: baseParams,
  };

  beforeEach(() => {
    qnaService = createMock<QnaService>({
      findOneBySlug: jest.fn().mockResolvedValue(testQnaEntity1),
    });
    docService = createMock<DocService>({
      findOneBySlug: jest.fn().mockResolvedValue(testDocEntity1),
    });
    teamMemberService = createMock<TeamMemberService>({
      findOneByOrgMemberAndTeam: jest
        .fn()
        .mockResolvedValue(testTeamMemberEntity1),
      findOneByOrgMemberAndTeamOrNull: jest
        .fn()
        .mockResolvedValue(testTeamMemberEntity1),
    });
    teamService = createMock<TeamService>({
      findOneBySlug: jest.fn().mockResolvedValue(testTeamEntity1),
      findOneById: jest.fn().mockResolvedValue(testTeamEntity1),
    });
    orgMemberService = createMock<OrgMemberService>({
      findOneByUserAndOrg: jest.fn().mockResolvedValue(testOrgMemberEntity1),
      findOneByOrgAndSlug: jest.fn().mockResolvedValue(testOrgMemberEntity1),
    });
    organizationService = createMock<OrganizationService>({
      findOneBySlug: jest.fn().mockResolvedValue(testOrganizationEntity1),
    });
    reflector = createMock<Reflector>({
      get: jest.fn().mockReturnValue([]),
    });
    guard = new RoleGuard(
      reflector,
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
    expect(guard).toBeDefined();
    expect(reflector).toBeDefined();
    expect(organizationService).toBeDefined();
    expect(orgMemberService).toBeDefined();
    expect(teamService).toBeDefined();
    expect(teamMemberService).toBeDefined();
    expect(docService).toBeDefined();
    expect(qnaService).toBeDefined();
    expect(context).toBeDefined();
  });

  describe('preliminary checks', () => {
    afterEach(() => {
      expect(reflector.get).toBeCalledTimes(1);
      expect(reflector.get).toBeCalledWith(ROLE_KEY, context.getHandler());
    });

    it('should return true if roles were never specified and org is not a route parameter', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);
      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ params: {} });
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });

    it('should return false if roles were specified and org is not a route parameter', async () => {
      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ params: {} });
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
      expect(organizationService.findOneBySlug).toBeCalledWith(
        testOrganizationEntity1.slug,
      );
      expect(context.switchToHttp().getRequest()[organizationKey]).toEqual(
        testOrganizationEntity1,
      );

      expect(orgMemberService.findOneByUserAndOrg).toBeCalledWith(
        testUserEntity1,
        testOrganizationEntity1,
      );
    });

    it(`should return true if roles contains org member's role`, async () => {
      jest.spyOn(reflector, 'get').mockReturnValue([OrgRoleEnum.Owner]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(context.switchToHttp().getRequest()[orgMemberKey]).toEqual(
        testOrgMemberEntity1,
      );
      expect(context.switchToHttp().getRequest()[orgMemberKey]).toEqual(
        testOrgMemberEntity1,
      );

      jest
        .spyOn(orgMemberService, 'findOneByUserAndOrg')
        .mockResolvedValue(moderator);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });

    it('should account for OrgMemberIfNoTeam', async () => {
      jest
        .spyOn(orgMemberService, 'findOneByUserAndOrg')
        .mockResolvedValue(member);
      jest
        .spyOn(reflector, 'get')
        .mockReturnValue([ConditionalRoleEnum.OrgMemberIfNoTeam]);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      const baseParams = {
        [Keyword.Organization]: testOrganizationEntity1.slug,
      };
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
        params: { ...baseParams, [Keyword.Qna]: testQnaEntity1.slug },
      });
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
        ...baseRequest,
        params: { ...baseParams, [Keyword.Doc]: testDocEntity1.slug },
      });
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });

    it('should account for OrgRoleGteSubject', async () => {
      jest
        .spyOn(orgMemberService, 'findOneByUserAndOrg')
        .mockResolvedValue(moderator);
      jest
        .spyOn(reflector, 'get')
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
      expect(orgMemberService.findOneByOrgAndSlug).toBeCalledWith(
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
        .spyOn(reflector, 'get')
        .mockReturnValue([TeamRoleEnum.Moderator, TeamRoleEnum.Owner]);
    });

    afterEach(() => {
      expect(teamService.findOneBySlug).toBeCalledWith(
        testOrganizationEntity1,
        testTeamEntity1.slug,
      );
      expect(context.switchToHttp().getRequest()[teamKey]).toEqual(
        testTeamEntity1,
      );

      expect(teamMemberService.findOneByOrgMemberAndTeamOrNull).toBeCalledWith(
        testOrgMemberEntity1,
        testTeamEntity1,
      );

      expect(teamMemberService.findOneByOrgMemberAndTeam).toBeCalledWith(
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
        .spyOn(teamMemberService, 'findOneByOrgMemberAndTeamOrNull')
        .mockResolvedValue(null);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(teamMemberService, 'findOneByOrgMemberAndTeamOrNull')
        .mockResolvedValue(member);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });

    it('should account for post teams', async () => {
      jest
        .spyOn(teamMemberService, 'findOneByOrgMemberAndTeamOrNull')
        .mockResolvedValueOnce(testTeamMemberEntity1)
        .mockResolvedValueOnce(member)
        .mockResolvedValue(member);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(teamMemberService, 'findOneByOrgMemberAndTeamOrNull')
        .mockResolvedValueOnce(testTeamMemberEntity1)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });

    it('should account for TeamRoleGteSubject', async () => {
      jest
        .spyOn(reflector, 'get')
        .mockReturnValue([
          TeamRoleEnum.Moderator,
          TeamRoleEnum.Owner,
          ConditionalRoleEnum.TeamRoleGteSubject,
        ]);
      jest
        .spyOn(teamMemberService, 'findOneByOrgMemberAndTeamOrNull')
        .mockResolvedValue(moderator);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest
        .spyOn(teamMemberService, 'findOneByOrgMemberAndTeam')
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
      expect(docService.findOneBySlug).toBeCalledWith(testDocEntity1.slug);
    });

    it('should return true if roles contains post role', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue([PostRoleEnum.Maintainer]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(context.switchToHttp().getRequest()[docKey]).toEqual(
        testDocEntity1,
      );

      jest.spyOn(docService, 'findOneBySlug').mockResolvedValue({
        ...testDocEntity1,
        maintainer: null,
      } as DocEntity);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest.spyOn(reflector, 'get').mockReturnValue([PostRoleEnum.Creator]);
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
      expect(qnaService.findOneBySlug).toBeCalledWith(testQnaEntity1.slug);
    });

    it('should return true if roles contains post maintainer role', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue([PostRoleEnum.Maintainer]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
      expect(context.switchToHttp().getRequest()[qnaKey]).toEqual(
        testQnaEntity1,
      );

      jest.spyOn(qnaService, 'findOneBySlug').mockResolvedValue({
        ...testQnaEntity1,
        maintainer: null,
      } as QnaEntity);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest.spyOn(reflector, 'get').mockReturnValue([PostRoleEnum.Creator]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();

      jest
        .spyOn(qnaService, 'findOneBySlug')
        .mockResolvedValue({ ...testQnaEntity1, creator: null } as QnaEntity);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });

    it('should account for CreatorIfNoAnswerInQna', async () => {
      jest
        .spyOn(reflector, 'get')
        .mockReturnValue([ConditionalRoleEnum.CreatorIfNoAnswerInQna]);
      await expect(guard.canActivate(context)).resolves.toBeFalsy();

      jest.spyOn(qnaService, 'findOneBySlug').mockResolvedValue({
        ...testQnaEntity1,
        answerHtml: null,
        answerMarkdoc: null,
        answerTxt: null,
      } as QnaEntity);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });
  });
});
