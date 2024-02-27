import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocService } from '@newbee/api/doc/data-access';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { QnaService } from '@newbee/api/qna/data-access';
import {
  DocEntity,
  OrgMemberEntity,
  OrganizationEntity,
  PostEntity,
  QnaEntity,
  TeamEntity,
  TeamMemberEntity,
  UserEntity,
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
  Keyword,
  RoleType,
  checkRoles,
  docWithoutOrgBadRequest,
  internalServerError,
  qnaWithoutOrgBadRequest,
  teamWithoutOrgBadRequest,
  unauthorizedError,
} from '@newbee/shared/util';

/**
 * A guard that prevents users from accessing endpoints annotated with role metadata unless they possess the required roles.
 *
 * Data stored in DTOs (from the request's query or body) should be dealt with within the route itself.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly em: EntityManager,
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
    // Get all of the roles annotated at the endpoint
    const roles = this.reflector.getAllAndOverride<RoleType[] | undefined>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Get the request object, its params, and the user making the request
    const request = context.switchToHttp().getRequest();
    const params: Record<string, string | undefined> = request.params;
    const user: UserEntity | undefined = request.user;

    // It's not possible for the user to have roles if they're not logged in!
    if (roles && !user) {
      throw new UnauthorizedException(unauthorizedError);
    }

    // Get all of the slugs we know to look for in the request's params
    const orgSlug: string | undefined = params[Keyword.Organization];
    const teamSlug: string | undefined = params[Keyword.Team];
    const orgMemberSlug: string | undefined = params[Keyword.Member];
    const docSlug: string | undefined = params[Keyword.Doc];
    const qnaSlug: string | undefined = params[Keyword.Qna];

    // Fill in info about the org, the requester's role within it, and the subject org member
    let organization: OrganizationEntity | null = null;
    let orgMember: OrgMemberEntity | null = null;
    let subjectOrgMember: OrgMemberEntity | null = null;
    if (orgSlug) {
      organization = await this.organizationService.findOneBySlug(orgSlug);
      request[organizationKey] = organization;

      orgMember = user
        ? await this.orgMemberService.findOneByOrgAndUserOrNull(
            user,
            organization,
          )
        : null;
      if (orgMember) {
        request[orgMemberKey] = orgMember;
      }

      if (orgMemberSlug) {
        subjectOrgMember = await this.orgMemberService.findOneByOrgAndSlug(
          organization,
          orgMemberSlug,
        );
        request[subjectOrgMemberKey] = subjectOrgMember;
      }
    }

    // It should not be possible to request a team without an org
    if (teamSlug && !organization) {
      throw new BadRequestException(teamWithoutOrgBadRequest);
    }

    // Fill in info about the team, the requester's role within it, and the subject team member
    let team: TeamEntity | null = null;
    let teamMember: TeamMemberEntity | null = null;
    let subjectTeamMember: TeamMemberEntity | null = null;
    if (teamSlug && organization) {
      team = await this.teamService.findOneByOrgAndSlug(organization, teamSlug);
      request[teamKey] = team;

      teamMember = orgMember
        ? await this.teamMemberService.findOneByTeamAndOrgMemberOrNull(
            orgMember,
            team,
          )
        : null;
      if (teamMember) {
        request[teamMemberKey] = teamMember;
      }

      if (subjectOrgMember) {
        subjectTeamMember =
          await this.teamMemberService.findOneByTeamAndOrgMember(
            subjectOrgMember,
            team,
          );
        request[subjectTeamMemberKey] = subjectTeamMember;
      }
    }

    // It should not be possible to request a doc without an org
    if (docSlug && !organization) {
      throw new BadRequestException(docWithoutOrgBadRequest);
    }

    // Fill in info about the doc
    // Now that we're down to the post-level, check if the post has the permissions to pass
    let doc: DocEntity | null = null;
    let docPasses: boolean | null = null;
    if (docSlug && organization) {
      doc = await this.docService.findOneBySlug(docSlug);
      request[docKey] = doc;
      docPasses = await this.checkPostRoles(
        roles ?? [],
        doc,
        user,
        orgMember,
        teamMember,
        subjectOrgMember,
        subjectTeamMember,
        team,
      );
    }

    // It should not be possible to request a qna without an org
    if (qnaSlug && !organization) {
      throw new BadRequestException(qnaWithoutOrgBadRequest);
    }

    // Fill in info about the qna
    // Now that we're down to the post-level, check if the post has the permissions to pass
    let qna: QnaEntity | null = null;
    let qnaPasses: boolean | null = null;
    if (qnaSlug && organization) {
      qna = await this.qnaService.findOneBySlug(qnaSlug);
      request[qnaKey] = qna;
      qnaPasses = await this.checkPostRoles(
        roles ?? [],
        qna,
        user,
        orgMember,
        teamMember,
        subjectOrgMember,
        subjectTeamMember,
        team,
      );
    }

    // If there's no post involved, we have to check the roles with the info we do have
    // If there's a post involved, honor only the results of the post's check
    return !!(
      !roles ||
      (roles &&
        ((docPasses === null &&
          qnaPasses === null &&
          checkRoles(roles, {
            userRole: user?.role,
            orgMember,
            teamRole: teamMember?.role,
            subjectOrgRole: subjectOrgMember?.role,
            subjectTeamRole: subjectTeamMember?.role,
            team: !!team,
          })) ||
          (docPasses && qnaPasses === null) ||
          (docPasses === null && qnaPasses) ||
          (docPasses && qnaPasses)))
    );
  }

  /**
   * Populates the given post and checks the roles associated with the post and org's teams.
   *
   * @param roles The roles to accept.
   * @param post The post to populate.
   * @param orgMember The org member making the request.
   * @param subjectOrgMember The org member being affected by the request.
   * @param subjectTeamMember The team member being affected by the request.
   * @param team The team being affected by the request.
   *
   * @returns `true` if the user has the permissions to work with the post, `false` otherwise.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async checkPostRoles(
    roles: RoleType[],
    post: PostEntity,
    user: UserEntity | null | undefined,
    orgMember: OrgMemberEntity | null | undefined,
    teamMember: TeamMemberEntity | null | undefined,
    subjectOrgMember: OrgMemberEntity | null | undefined,
    subjectTeamMember: TeamMemberEntity | null | undefined,
    team: TeamEntity | null | undefined,
  ): Promise<boolean> {
    try {
      await this.em.populate(post, ['team', 'creator', 'maintainer']);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }

    const { team: postTeam, creator, maintainer } = post;
    const postTeamMember =
      team && orgMember
        ? await this.teamMemberService.findOneByTeamAndOrgMemberOrNull(
            orgMember,
            team,
          )
        : null;

    return (
      checkRoles(roles, {
        userRole: user?.role,
        orgMember,
        teamRole: teamMember?.role,
        subjectOrgRole: subjectOrgMember?.role,
        subjectTeamRole: subjectTeamMember?.role,
        team: !!team,
        postCreator: creator,
        postMaintainer: maintainer,
      }) &&
      checkRoles(roles, {
        userRole: user?.role,
        orgMember,
        teamRole: postTeamMember?.role,
        subjectOrgRole: subjectOrgMember?.role,
        subjectTeamRole: subjectTeamMember?.role,
        team: !!postTeam,
        postCreator: creator,
        postMaintainer: maintainer,
      })
    );
  }
}
