import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocService } from '@newbee/api/doc/data-access';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { QnaService } from '@newbee/api/qna/data-access';
import {
  OrgMemberEntity,
  PostEntity,
  TeamEntity,
  TeamMemberEntity,
} from '@newbee/api/shared/data-access';
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
import {
  Keyword,
  OrgRoleEnum,
  compareOrgRoles,
  compareTeamRoles,
  teamRoleEnumSet,
} from '@newbee/shared/util';

/**
 * A guard that prevents users from accessing endpoints annotated with role metadata unless they possess the required roles.
 *
 * This guard should only deal with data we can obtain from the route params.
 * Data stored in DTOs (from the request's query or body) should be deal with within the route itself.
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
    private readonly qnaService: QnaService,
  ) {}

  /**
   * Allows users to access a given route if:
   *
   * - The `ROLE_KEY` metadata key does not exist for the route.
   * - The user has a role specified in the roles metadata.
   *
   * Boolean checks are cheap and querying the database is expensive, so the method will take whatever shortcuts it can to avoid querying.
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
    const { params, user } = request;
    const orgSlug: string | undefined = params[Keyword.Organization];

    // Fail if org slug wasn't specified but roles were
    // Pass if both org slug and roles weren't specified
    if (!orgSlug) {
      return result;
    }

    const teamSlug: string | undefined = params[Keyword.Team];
    const orgMemberSlug: string | undefined = params[Keyword.Member];
    const docSlug: string | undefined = params[Keyword.Doc];
    const qnaSlug: string | undefined = params[Keyword.Qna];

    const organization = await this.organizationService.findOneBySlug(orgSlug);
    request[organizationKey] = organization;

    const orgMember = await this.orgMemberService.findOneByUserAndOrg(
      user,
      organization,
    );
    request[orgMemberKey] = orgMember;

    // See if we can pass with the org info we have right now
    // Also check if it's possible there will be any team info in the future and take that into account
    if (
      !result &&
      roles &&
      (RoleGuard.checkOrgRoles(orgMember, null, roles) ||
        (!teamSlug &&
          !docSlug &&
          !qnaSlug &&
          roles.includes(ConditionalRoleEnum.OrgMemberIfNoTeam) &&
          orgMember.role === OrgRoleEnum.Member))
    ) {
      result = true;
    }

    // If we are not passing yet and there are no roles related to teams, posts, or specific conditional requirements, just fail as the user cannot possibly have adequate permissions
    if (
      !result &&
      !roles?.some(
        (role) =>
          teamRoleEnumSet.has(role) ||
          postRoleEnumSet.has(role) ||
          conditionalRoleEnumSet.has(role),
      )
    ) {
      return result;
    }

    if (orgMemberSlug) {
      const subjectOrgMember = await this.orgMemberService.findOneByOrgAndSlug(
        organization,
        orgMemberSlug,
      );
      request[subjectOrgMemberKey] = subjectOrgMember;

      // Check to see if knowing the subject's org member role can help us pass
      if (
        !result &&
        roles &&
        RoleGuard.checkOrgRoles(orgMember, subjectOrgMember, roles)
      ) {
        result = true;
      }
    }

    // If team slug was specified, see if team member roles will help user pass
    // If a post slug was also specified, we have to ensure team permissions are met on both the post's team and the param's team
    if (teamSlug) {
      const team = await this.teamService.findOneBySlug(organization, teamSlug);
      request[teamKey] = team;

      const teamMember =
        await this.teamMemberService.findOneByOrgMemberAndTeamOrNull(
          orgMember,
          team,
        );
      if (teamMember) {
        request[teamMemberKey] = teamMember;

        // The team member role is enough to pass on its own only if there's no post team to worry about
        if (
          !result &&
          roles &&
          !docSlug &&
          !qnaSlug &&
          RoleGuard.checkTeamRoles(orgMember, team, teamMember, null, roles)
        ) {
          result = true;
        }
      }

      if (orgMemberSlug) {
        const subjectOrgMember: OrgMemberEntity = request[subjectOrgMemberKey];
        const subjectTeamMember =
          await this.teamMemberService.findOneByOrgMemberAndTeam(
            subjectOrgMember,
            team,
          );
        request[subjectTeamMemberKey] = subjectTeamMember;

        // Check if knowing the subject team member's role will help us pass
        // Enough to pass on its own only if there's no post team to worry about
        if (
          !result &&
          !docSlug &&
          !qnaSlug &&
          roles &&
          RoleGuard.checkTeamRoles(
            orgMember,
            team,
            teamMember,
            subjectTeamMember,
            roles,
          )
        ) {
          result = true;
        }
      }
    }

    // If doc slug was specified, see if doc roles will help user pass
    if (docSlug) {
      const doc = await this.docService.findOneBySlug(docSlug);
      request[docKey] = doc;

      if (
        !result &&
        roles &&
        ((await this.checkPostTeam(doc, orgMember, request, roles)) ||
          RoleGuard.checkPostRoles(doc, orgMember, roles))
      ) {
        result = true;
      }
    }

    // If qna slug was specified, see if qna roles will help users pass
    if (qnaSlug) {
      const qna = await this.qnaService.findOneBySlug(qnaSlug);
      request[qnaKey] = qna;

      if (
        !result &&
        roles &&
        ((await this.checkPostTeam(qna, orgMember, request, roles)) ||
          RoleGuard.checkPostRoles(qna, orgMember, roles) ||
          (roles.includes(ConditionalRoleEnum.CreatorIfNoAnswerInQna) &&
            !qna.answerMarkdoc &&
            !qna.answerHtml &&
            !qna.answerTxt &&
            qna.creator === orgMember))
      ) {
        result = true;
      }
    }

    return result;
  }

  /**
   * A helper function for checking the user's team roles if they are working with an existing post.
   * In such cases, users should meet team role requirements for the teams specified in the request AND the post.
   *
   * @param post The post to check.
   * @param orgMember The org member making the request.
   * @param request The request object, to check for annotations.
   * @param roles The roles the route has been annotated with.
   *
   * @returns `true` if team-level permissions succeeded the check, `false` otherwise.
   * @throws {InternalServerErrorException} `internalServerError`. If the services throw an error.
   */
  private async checkPostTeam(
    post: PostEntity,
    orgMember: OrgMemberEntity,
    request: Record<string, unknown>,
    roles: RoleType[],
  ): Promise<boolean> {
    // Get the values for team and team member, if team slug was specified
    const team = request[teamKey] as TeamEntity | undefined;
    const teamMember = request[teamMemberKey] as TeamMemberEntity | undefined;
    const subjectTeamMember = request[subjectTeamMemberKey] as
      | TeamMemberEntity
      | undefined;

    // Check if the request team and team member have the adequate permissions to pass
    const requestTeamPasses = RoleGuard.checkTeamRoles(
      orgMember,
      team ?? null,
      teamMember ?? null,
      subjectTeamMember ?? null,
      roles,
    );

    // If the post doesn't specify a team, examine the request's team in isolation
    if (!post.team) {
      return requestTeamPasses;
    }

    const postTeam = await this.teamService.findOneById(post.team.id);
    const postTeamMember =
      await this.teamMemberService.findOneByOrgMemberAndTeamOrNull(
        orgMember,
        postTeam,
      );

    // Check if the post team and team member have the adequate permissions to pass
    return (
      requestTeamPasses &&
      RoleGuard.checkTeamRoles(
        orgMember,
        postTeam,
        postTeamMember,
        subjectTeamMember ?? null,
        roles,
      )
    );
  }

  /**
   * Checks that the requester has the necessary org-related permissions to make the request.
   *
   * Should pass if `roles` includes the org member's role, but should only pass if the requester's role is >= the subject's role if OrgRoleGteSubject is specified.
   *
   * @param orgMember The requester's role in the org.
   * @param subjectOrgMember The org member being affected by the request, if any.
   * @param roles The roles the route has been annotated with.
   *
   * @returns `true` if the requester has the adequate permissions, `false` if not.
   */
  private static checkOrgRoles(
    orgMember: OrgMemberEntity,
    subjectOrgMember: OrgMemberEntity | null,
    roles: RoleType[],
  ): boolean {
    return !!(
      roles.includes(orgMember.role) &&
      (!roles.includes(ConditionalRoleEnum.OrgRoleGteSubject) ||
        (subjectOrgMember &&
          compareOrgRoles(orgMember.role, subjectOrgMember.role) >= 0))
    );
  }

  /**
   * Checks that the requester has the necessary team-related permissions to make the request.
   *
   * Should pass if no team was specified, but OrgMemberIfNoTeam was specified.
   * If there is a team member, pass if `roles` includes the team member's role, but should only pass if the requester's role is >= subject's role if TeamRoleGteSubject is specified.
   *
   * @param orgMember The requester's role in the org.
   * @param team The team related to the request, if any.
   * @param teamMember The requester's role in the team, if any.
   * @param subjectTeamMember The team member being affected by the request, if any.
   * @param roles The roles the route has been annotated with.
   *
   * @returns `true` if the requester has the adequate permissions, `false` if not.
   */
  private static checkTeamRoles(
    orgMember: OrgMemberEntity,
    team: TeamEntity | null,
    teamMember: TeamMemberEntity | null,
    subjectTeamMember: TeamMemberEntity | null,
    roles: RoleType[],
  ): boolean {
    return !!(
      (!team &&
        roles.includes(ConditionalRoleEnum.OrgMemberIfNoTeam) &&
        orgMember.role === OrgRoleEnum.Member) ||
      (teamMember &&
        roles.includes(teamMember.role) &&
        (!roles.includes(ConditionalRoleEnum.TeamRoleGteSubject) ||
          (subjectTeamMember &&
            compareTeamRoles(teamMember.role, subjectTeamMember.role) >= 0)))
    );
  }

  /**
   * Checks whether roles contains a relevant PostRoleEnum for the given post and org member.
   *
   * Should pass if `roles` includes the a post role and the org member holds that role in the post.
   * Also takes into account conditional roles based on post roles.
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
    return (
      (roles.includes(PostRoleEnum.Creator) && post.creator === orgMember) ||
      (roles.includes(PostRoleEnum.Maintainer) && post.maintainer === orgMember)
    );
  }
}
