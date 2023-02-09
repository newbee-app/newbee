import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { DocService } from '@newbee/api/doc/data-access';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { QnaService } from '@newbee/api/qna/data-access';
import {
  testDocEntity1,
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testQnaEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import {
  OrgRoleEnum,
  PostRoleEnum,
  ROLE_KEY,
  TeamRoleEnum,
} from '@newbee/api/shared/util';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import { TeamService } from '@newbee/api/team/data-access';
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
    });
    teamService = createMock<TeamService>({
      findOneByName: jest.fn().mockResolvedValue(testTeamEntity1),
    });
    orgMemberService = createMock<OrgMemberService>({
      findOneByUserAndOrg: jest.fn().mockResolvedValue(testOrgMemberEntity1),
    });
    organizationService = createMock<OrganizationService>({
      findOneByName: jest.fn().mockResolvedValue(testOrganizationEntity1),
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
      qnaService
    );
    context = createMock<ExecutionContext>({
      switchToHttp: jest.fn().mockReturnValue(
        createMock<HttpArgumentsHost>({
          getRequest: jest.fn().mockReturnValue({
            params: {
              organizationName: testOrganizationEntity1.name,
              teamName: testTeamEntity1.name,
              docSlug: testDocEntity1.slug,
              qnaSlug: testQnaEntity1.slug,
            },
            query: {
              teamName: testTeamEntity1.name,
            },
            user: testUserEntity1,
          }),
        })
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

    it('should return true if roles were never specified', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });

    it('should return false if organizationName is not a route parameter', async () => {
      jest
        .spyOn(context.switchToHttp(), 'getRequest')
        .mockReturnValue({ params: {} });
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });
  });

  describe('service exception check', () => {
    it('should return false if organization service throws an error', async () => {
      jest
        .spyOn(organizationService, 'findOneByName')
        .mockRejectedValue(new Error('findOneByName'));
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
      expect(organizationService.findOneByName).toBeCalledTimes(1);
      expect(organizationService.findOneByName).toBeCalledWith(
        testOrganizationEntity1.name
      );
    });

    it('should return false if org member service throws an error', async () => {
      jest
        .spyOn(orgMemberService, 'findOneByUserAndOrg')
        .mockRejectedValue(new Error('findOneByUserAndOrg'));
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
      expect(orgMemberService.findOneByUserAndOrg).toBeCalledTimes(1);
      expect(orgMemberService.findOneByUserAndOrg).toBeCalledWith(
        testUserEntity1,
        testOrganizationEntity1
      );
    });

    it('should return false if team service throws an error', async () => {
      jest
        .spyOn(teamService, 'findOneByName')
        .mockRejectedValue(new Error('findOneByName'));
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
      expect(teamService.findOneByName).toBeCalledTimes(1);
      expect(teamService.findOneByName).toBeCalledWith(
        testOrganizationEntity1,
        testTeamEntity1.name
      );
    });

    it('should return false if team member service throws an error', async () => {
      jest
        .spyOn(teamMemberService, 'findOneByOrgMemberAndTeam')
        .mockRejectedValue(new Error('findOneByOrgMemberAndTeam'));
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
      expect(teamMemberService.findOneByOrgMemberAndTeam).toBeCalledTimes(1);
      expect(teamMemberService.findOneByOrgMemberAndTeam).toBeCalledWith(
        testOrgMemberEntity1,
        testTeamEntity1
      );
    });

    it('should return false if doc service throws an error', async () => {
      jest
        .spyOn(docService, 'findOneBySlug')
        .mockRejectedValue(new Error('findOneBySlug'));
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
      expect(docService.findOneBySlug).toBeCalledTimes(1);
      expect(docService.findOneBySlug).toBeCalledWith(
        testOrganizationEntity1,
        testDocEntity1.slug
      );
    });

    it('should return false if qna service throws an error', async () => {
      jest
        .spyOn(qnaService, 'findOneBySlug')
        .mockRejectedValue(new Error('findOneBySlug'));
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });
  });

  describe('org member role check', () => {
    afterEach(() => {
      expect(organizationService.findOneByName).toBeCalledTimes(1);
      expect(organizationService.findOneByName).toBeCalledWith(
        testOrganizationEntity1.name
      );
      expect(orgMemberService.findOneByUserAndOrg).toBeCalledTimes(1);
      expect(orgMemberService.findOneByUserAndOrg).toBeCalledWith(
        testUserEntity1,
        testOrganizationEntity1
      );
    });

    it(`should return true if roles contains org member's role`, async () => {
      jest.spyOn(reflector, 'get').mockReturnValue([OrgRoleEnum.Owner]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });
  });

  describe('team member role check', () => {
    afterEach(() => {
      expect(teamService.findOneByName).toBeCalledTimes(1);
      expect(teamService.findOneByName).toBeCalledWith(
        testOrganizationEntity1,
        testTeamEntity1.name
      );
      expect(teamMemberService.findOneByOrgMemberAndTeam).toBeCalledTimes(1);
      expect(teamMemberService);
    });

    it(`should return true if roles contains team member's role`, async () => {
      jest.spyOn(reflector, 'get').mockReturnValue([TeamRoleEnum.Owner]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });
  });

  describe('doc role check', () => {
    afterEach(() => {
      expect(docService.findOneBySlug).toBeCalledTimes(1);
      expect(docService.findOneBySlug).toBeCalledWith(
        testOrganizationEntity1,
        testDocEntity1.slug
      );
    });

    it('should return true if roles contains post maintainer role', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue([PostRoleEnum.Maintainer]);
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });
  });

  describe('qna role check', () => {
    afterEach(() => {
      expect(qnaService.findOneBySlug).toBeCalledTimes(1);
      expect(qnaService.findOneBySlug).toBeCalledWith(
        testOrganizationEntity1,
        testQnaEntity1.slug
      );
    });

    it('should return true if roles contains post maintainer role', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue([PostRoleEnum.Maintainer]);
      jest.spyOn(docService, 'findOneBySlug').mockResolvedValue({
        ...testDocEntity1,
        maintainer: null,
      });
      await expect(guard.canActivate(context)).resolves.toBeTruthy();
    });

    it('should return false if no roles match', async () => {
      await expect(guard.canActivate(context)).resolves.toBeFalsy();
    });
  });
});
