import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocService } from '@newbee/api/doc/data-access';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { QnaService } from '@newbee/api/qna/data-access';
import { OrgMemberEntity, PostEntity } from '@newbee/api/shared/data-access';
import {
  ConditionalRoleEnum,
  OrgRoleEnum,
  PostRoleEnum,
  RoleType,
  ROLE_KEY,
} from '@newbee/api/shared/util';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import { doc, organization, qna, team } from '@newbee/shared/data-access';

/**
 * A guard that prevents users from accessing endpoints annotated with role metadata unless they possess the required roles.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly organizationService: OrganizationService,
    private readonly orgMemberService: OrgMemberService,
    private readonly teamService: TeamService,
    private readonly teamMemberService: TeamMemberService,
    private readonly docService: DocService,
    private readonly qnaService: QnaService
  ) {}

  /**
   * Allows users to access a given route if:
   *
   * - The `ROLE_KEY` metadata key does not exist for the route.
   * - The user has a role specified in the roles metadata.
   *
   * @param context The context of the request.
   * @returns `true` if roles weren't specified or if the user has one of the requisite roles, `false` otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RoleType[] | undefined>(
      ROLE_KEY,
      context.getHandler()
    );
    // pass if roles weren't specified
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { params, query, user } = request;
    const orgSlug: string | undefined = params[organization];
    // fail if org slug wasn't specified but roles were
    if (!orgSlug) {
      return false;
    }

    const teamSlug: string | undefined = params[team]
      ? params[team]
      : query[team];
    const docSlug: string | undefined = params[doc];
    const qnaSlug: string | undefined = params[qna];

    try {
      const organization = await this.organizationService.findOneBySlug(
        orgSlug
      );
      const orgMember = await this.orgMemberService.findOneByUserAndOrg(
        user,
        organization
      );

      if (roles.includes(orgMember.role)) {
        return true;
      }

      if (
        roles.includes(ConditionalRoleEnum.OrgMemberIfNoTeamInReq) &&
        orgMember.role === OrgRoleEnum.Member &&
        !teamSlug
      ) {
        return true;
      }

      // if team name was specified, see if team member roles will help user pass
      if (teamSlug) {
        const team = await this.teamService.findOneBySlug(
          organization,
          teamSlug
        );
        const teamMember =
          await this.teamMemberService.findOneByOrgMemberAndTeam(
            orgMember,
            team
          );

        if (roles.includes(teamMember.role)) {
          return true;
        }
      }

      // if doc slug was specified, see if doc roles will help user pass
      if (docSlug) {
        const doc = await this.docService.findOneBySlug(docSlug);
        if (RoleGuard.checkPostRoles(doc, orgMember, roles)) {
          return true;
        }
      }

      // if qna slug was specified, see if qna roles will help users pass
      if (qnaSlug) {
        const qna = await this.qnaService.findOneBySlug(qnaSlug);
        if (RoleGuard.checkPostRoles(qna, orgMember, roles)) {
          return true;
        }

        if (
          roles.includes(ConditionalRoleEnum.OrgMemberIfNoTeamInQna) &&
          orgMember.role === OrgRoleEnum.Member &&
          !qna.team
        ) {
          return true;
        }
      }

      return false;
    } catch (err) {
      // fail if any of the services throw an error
      return false;
    }
  }

  /**
   * Checks whether roles contains a relevant post-related role for the given post and org member.
   *
   * @param post The post in question.
   * @param orgMember The org member to check.
   * @param roles The roles to check.
   *
   * @returns `true` if roles has a post-related role for the given post and org member, `false` if not.
   */
  private static checkPostRoles(
    post: PostEntity,
    orgMember: OrgMemberEntity,
    roles: RoleType[]
  ): boolean {
    const isCreator = post.creator === orgMember;
    const isMaintainer = post.maintainer === orgMember;
    return roles.some(
      (role) =>
        (isCreator && role === PostRoleEnum.Creator) ||
        (isMaintainer && role === PostRoleEnum.Maintainer)
    );
  }
}
