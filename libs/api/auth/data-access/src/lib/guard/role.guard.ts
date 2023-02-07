import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import {
  organizationName,
  RoleType,
  ROLE_KEY,
  teamName,
} from '@newbee/api/shared/util';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import { TeamService } from '@newbee/api/team/data-access';

/**
 * A guard that prevents users from accessing endpoints annotated with role metadata unless they possess the required role.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly organizationService: OrganizationService,
    private readonly orgMemberService: OrgMemberService,
    private readonly teamService: TeamService,
    private readonly teamMemberService: TeamMemberService
  ) {}

  /**
   * Allows users to access a given route if:
   *
   * - The `ROLE_KEY` metadata key does not exist for the route.
   * - The user has a role specified in the roles metadata.
   *
   * @param context The context of the request.
   * @returns `true` if roles weren't specified or if the user has the requisite role, `false` otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RoleType[] | undefined>(
      ROLE_KEY,
      context.getHandler()
    );
    // if roles weren't specified, pass
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { params, query, user } = request;
    const orgName: string | undefined = params[organizationName];
    // if org name wasn't specified but roles were, fail
    if (!orgName) {
      return false;
    }

    try {
      const organization = await this.organizationService.findOneByName(
        orgName
      );
      const orgMember = await this.orgMemberService.findOneByUserAndOrg(
        user,
        organization
      );

      // if roles has the user's org member role, pass
      if (roles.includes(orgMember.role)) {
        return true;
      }

      const tName: string | undefined = params[teamName]
        ? params[teamName]
        : query[teamName];
      // if team name wasn't specified and roles doesn' have the user's org member role, fail
      if (!tName) {
        return false;
      }

      const team = await this.teamService.findOneByName(organization, tName);
      const teamMember = await this.teamMemberService.findOneByOrgMemberAndTeam(
        orgMember,
        team
      );

      // if roles has the user's team member role, pass
      return roles.includes(teamMember.role);
    } catch (err) {
      return false;
    }
  }
}
