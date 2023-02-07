import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  testOrganizationEntity1,
  testOrgMemberEntity1,
  testTeamEntity1,
  testTeamMemberEntity1,
  testUserEntity1,
} from '@newbee/api/shared/data-access';
import { OrgRoleEnum, ROLE_KEY, TeamRoleEnum } from '@newbee/api/shared/util';
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
  let context: ExecutionContext;

  beforeEach(() => {
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
      get: jest.fn().mockReturnValue([TeamRoleEnum.Owner]),
    });
    guard = new RoleGuard(
      reflector,
      organizationService,
      orgMemberService,
      teamService,
      teamMemberService
    );
    context = createMock<ExecutionContext>({
      switchToHttp: jest.fn().mockReturnValue(
        createMock<HttpArgumentsHost>({
          getRequest: jest.fn().mockReturnValue({
            params: {
              organizationName: testOrganizationEntity1.name,
              teamName: testTeamEntity1.name,
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
    expect(context).toBeDefined();
  });

  describe('calls reflector', () => {
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

    describe('calls organizationService', () => {
      afterEach(() => {
        expect(organizationService.findOneByName).toBeCalledTimes(1);
        expect(organizationService.findOneByName).toBeCalledWith(
          testOrganizationEntity1.name
        );
      });

      it('should return false if organization does not exist', async () => {
        jest
          .spyOn(organizationService, 'findOneByName')
          .mockRejectedValue(new Error('findOneByName'));
        await expect(guard.canActivate(context)).resolves.toBeFalsy();
      });
    });

    describe('calls orgMemberService', () => {
      afterEach(() => {
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

      it('should return false if org member does not exist', async () => {
        jest
          .spyOn(orgMemberService, 'findOneByUserAndOrg')
          .mockRejectedValue(new Error('findOneByUserAndOrg'));
        await expect(guard.canActivate(context)).resolves.toBeFalsy();
      });

      it('should return false if teamName is not a route or query parameter', async () => {
        jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({
          params: { organizationName: testOrganizationEntity1.name },
          query: {},
          user: testUserEntity1,
        });
        await expect(guard.canActivate(context)).resolves.toBeFalsy();
      });

      describe('calls teamService', () => {
        afterEach(() => {
          expect(teamService.findOneByName).toBeCalledTimes(1);
          expect(teamService.findOneByName).toBeCalledWith(
            testOrganizationEntity1,
            testTeamEntity1.name
          );
        });

        it('should return false if team does not exist', async () => {
          jest
            .spyOn(teamService, 'findOneByName')
            .mockRejectedValue(new Error('findOneByName'));
          await expect(guard.canActivate(context)).resolves.toBeFalsy();
        });
      });

      describe('calls teamMemberService', () => {
        afterEach(() => {
          expect(teamMemberService.findOneByOrgMemberAndTeam).toBeCalledTimes(
            1
          );
          expect(teamMemberService.findOneByOrgMemberAndTeam).toBeCalledWith(
            testOrgMemberEntity1,
            testTeamEntity1
          );
        });

        it('should return true if team member has required role', async () => {
          await expect(guard.canActivate(context)).resolves.toBeTruthy();
        });

        it('should return false if team member does not exist', async () => {
          jest
            .spyOn(teamMemberService, 'findOneByOrgMemberAndTeam')
            .mockRejectedValue(new Error('findOneByOrgMemberAndTeam'));
          await expect(guard.canActivate(context)).resolves.toBeFalsy();
        });

        it('should return false if team member does not have required role', async () => {
          jest
            .spyOn(teamMemberService, 'findOneByOrgMemberAndTeam')
            .mockResolvedValue({
              ...testTeamMemberEntity1,
              role: TeamRoleEnum.Member,
            });
          await expect(guard.canActivate(context)).resolves.toBeFalsy();
        });
      });
    });
  });
});
