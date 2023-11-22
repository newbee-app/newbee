import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocService } from '@newbee/api/doc/data-access';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { QnaService } from '@newbee/api/qna/data-access';
import { OrgMemberEntity, PostEntity } from '@newbee/api/shared/data-access';
import {
  ConditionalRoleEnum,
  PostRoleEnum,
  ROLE_KEY,
  RoleType,
  conditionalRoleEnumSet,
  docKey,
  orgMemberKey,
  organizationKey,
  postRoleEnumSet,
  qnaKey,
  subjectOrgMemberKey,
  subjectTeamMemberKey,
  teamKey,
  teamMemberKey,
} from '@newbee/api/shared/util';
import { TeamMemberService } from '@newbee/api/team-member/data-access';
import { TeamService } from '@newbee/api/team/data-access';
import { Keyword, OrgRoleEnum, teamRoleEnumSet } from '@newbee/shared/util';

/**
 * A guard that prevents users from accessing endpoints annotated with role metadata unless they possess the required roles.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  /**
   * The logger to use when logging anything in the guard.
   */
  private readonly logger = new Logger(RoleGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly organizationService: OrganizationService,
    private readonly orgMemberService: OrgMemberService,
    private readonly teamService: TeamService,
    private readonly teamMemberService: TeamMemberService,
    private readonly docService: DocService,
    private readonly qnaService: QnaService,
  ) {}

  /**
   * Allows users to access a given route if:
   *
   * - The `ROLE_KEY` metadata key does not exist for the route.
   * - The user has a role specified in the roles metadata.
   *
   * @param context The context of the request.
   *
   * @returns `true` if roles weren't specified or if the user has one of the requisite roles, `false` otherwise.
   * @throws {NotFoundException} `organizationSlugNotFound`, `orgMemberNotFound`, `teamSlugNotFound`, `teamMemberNotFound`, `docSlugNotFound`, `qnaSlugNotFound`. If any of the services throw a `NotFoundException`.
   * @throws {InternalServerErrorException} `internalServerError`. If any of the services throws an error.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let result = false;

    // Get all of the roles annotated at the endpoint
    const roles = this.reflector.get<RoleType[] | undefined>(
      ROLE_KEY,
      context.getHandler(),
    );

    // If no roles were specified, we should pass
    // But we don't return right away to annotate the req object with entity data
    if (!roles) {
      result = true;
    }

    const request = context.switchToHttp().getRequest();
    const { params, query, body, user } = request;
    const orgSlug: string | undefined = params[Keyword.Organization];

    // fail if org slug wasn't specified but roles were
    // pass if both org slug and roles weren't specified
    if (!orgSlug) {
      return result;
    }

    // Look for the team slug first in the params, then the query string, then the req body
    const teamSlug: string | null | undefined = params[Keyword.Team]
      ? params[Keyword.Team]
      : query[Keyword.Team]
      ? query[Keyword.Team]
      : body[Keyword.Team];

    const orgMemberSlug: string | undefined = params[Keyword.Member];
    const docSlug: string | undefined = params[Keyword.Doc];
    const qnaSlug: string | undefined = params[Keyword.Qna];

    try {
      const organization =
        await this.organizationService.findOneBySlug(orgSlug);
      request[organizationKey] = organization;

      const orgMember = await this.orgMemberService.findOneByUserAndOrg(
        user,
        organization,
      );
      request[orgMemberKey] = orgMember;

      // If roles includes the org member's role or specific conditional requirements are met, then pass
      if (
        roles?.includes(orgMember.role) ||
        (roles?.includes(ConditionalRoleEnum.OrgMemberIfNoTeamInReq) &&
          orgMember.role === OrgRoleEnum.Member &&
          !teamSlug)
      ) {
        result = true;
      }

      // If there are no roles related to teams, posts, or specific conditional requirements and we are not passing yet, just fail as the user cannot possibly have adequate permissions
      if (
        !roles?.some(
          (role) =>
            teamRoleEnumSet.has(role) ||
            postRoleEnumSet.has(role) ||
            conditionalRoleEnumSet.has(role),
        ) &&
        !result
      ) {
        return result;
      }

      if (orgMemberSlug) {
        const subjectOrgMember =
          await this.orgMemberService.findOneByOrgAndSlug(
            organization,
            orgMemberSlug,
          );
        request[subjectOrgMemberKey] = subjectOrgMember;
      }

      // If team name was specified, see if team member roles will help user pass
      // There is a chance that a team member does not exist, as it's possible the user is an org member with adequate permissions to affect team data, so we must handle that
      if (teamSlug) {
        const team = await this.teamService.findOneBySlug(
          organization,
          teamSlug,
        );
        request[teamKey] = team;

        const teamMember =
          await this.teamMemberService.findOneByOrgMemberAndTeamOrNull(
            orgMember,
            team,
          );
        if (teamMember) {
          request[teamMemberKey] = teamMember;
          if (roles?.includes(teamMember.role)) {
            result = true;
          }
        }

        if (orgMemberSlug) {
          const subjectOrgMember: OrgMemberEntity =
            request[subjectOrgMemberKey];
          const subjectTeamMember =
            await this.teamMemberService.findOneByOrgMemberAndTeam(
              subjectOrgMember,
              team,
            );
          request[subjectTeamMemberKey] = subjectTeamMember;
        }
      }

      // if doc slug was specified, see if doc roles will help user pass
      if (docSlug) {
        const doc = await this.docService.findOneBySlug(docSlug);
        request[docKey] = doc;

        if (
          (roles && RoleGuard.checkPostRoles(doc, orgMember, roles)) ||
          (roles?.includes(ConditionalRoleEnum.OrgMemberIfNoTeamInDoc) &&
            orgMember.role === OrgRoleEnum.Member &&
            !doc.team)
        ) {
          result = true;
        }
      }

      // if qna slug was specified, see if qna roles will help users pass
      if (qnaSlug) {
        const qna = await this.qnaService.findOneBySlug(qnaSlug);
        request[qnaKey] = qna;

        if (
          (roles && RoleGuard.checkPostRoles(qna, orgMember, roles)) ||
          (roles?.includes(ConditionalRoleEnum.OrgMemberIfNoTeamInQna) &&
            orgMember.role === OrgRoleEnum.Member &&
            !qna.team)
        ) {
          result = true;
        }
      }
    } catch (err) {
      this.logger.error(err);

      if (
        err instanceof NotFoundException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }

      return false;
    }

    return result;
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
    roles: RoleType[],
  ): boolean {
    const isCreator = post.creator === orgMember;
    const isMaintainer = post.maintainer === orgMember;
    return roles.some(
      (role) =>
        (isCreator && role === PostRoleEnum.Creator) ||
        (isMaintainer && role === PostRoleEnum.Maintainer),
    );
  }
}
