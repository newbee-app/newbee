import { Body, Controller, Delete, Logger, Patch, Post } from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import {
  OrganizationEntity,
  OrgMemberEntity,
  TeamEntity,
  TeamMemberEntity,
} from '@newbee/api/shared/data-access';
import {
  Organization,
  OrgMember,
  Role,
  SubjectOrgMember,
  SubjectTeamMember,
  Team,
  TeamMember,
} from '@newbee/api/shared/util';
import {
  CreateTeamMemberDto,
  TeamMemberService,
  UpdateTeamMemberDto,
} from '@newbee/api/team-member/data-access';
import { teamMemberVersion, UrlEndpoint } from '@newbee/shared/data-access';
import { OrgRoleEnum, TeamRoleEnum } from '@newbee/shared/util';

/**
 * The controller that interacts with `TeamMemberEntity`.
 */
@Controller({
  path: `${UrlEndpoint.Organization}/:${UrlEndpoint.Organization}/${UrlEndpoint.Team}/:${UrlEndpoint.Team}/${UrlEndpoint.Member}`,
  version: teamMemberVersion,
})
export class TeamMemberController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(TeamMemberController.name);

  constructor(
    private readonly teamMemberService: TeamMemberService,
    private readonly orgMemberService: OrgMemberService
  ) {}

  /**
   * The API route for creating a team member.
   *
   * @param createTeamMemberDto The information necessary to create a team member.
   * @param orgMember The org member making the request.
   * @param teamMember The team member making the request, if applicable.
   * @param organization The organization that contains the team.
   * @param team The team to add the invitee to.
   *
   * @returns The new team member.
   * @throws {NotFoundException} `orgMemberNotFound`. If the invitee can not be found in the org.
   * @throws {ForbiddenException} `forbiddenError`. If the user is trying to create a team member with permissions that exceed their own.
   * @throws {BadRequestException} `userAlreadyTeamMemberBadRequest`. If the invitee is already a team member.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Post()
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner
  )
  async create(
    @Body() createTeamMemberDto: CreateTeamMemberDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @TeamMember() teamMember: TeamMemberEntity | undefined,
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity
  ): Promise<TeamMemberEntity> {
    this.logger.log(
      `Create team member request received from org member slug: ${
        orgMember.slug
      }, in organization ID: ${organization.id}, in team ID: ${
        team.id
      }, with values: ${JSON.stringify(createTeamMemberDto)}`
    );

    const { role, orgMemberSlug } = createTeamMemberDto;
    const invitee = await this.orgMemberService.findOneByOrgAndSlug(
      organization,
      orgMemberSlug
    );
    const newTeamMember = await this.teamMemberService.create(
      invitee,
      team,
      role,
      orgMember.role,
      teamMember?.role ?? null
    );
    this.logger.log(`Team member created for org member: ${invitee.slug}`);

    return newTeamMember;
  }

  /**
   * The API route for updating the role of a team member.
   *
   * @param updateTeamMemberDto The new role for the team member.
   * @param orgMember The org member making the request.
   * @param teamMember The team member making the request, if applicable.
   * @param subjectOrgMember The org member being affected.
   * @param subjectTeamMember The team member being affected.
   * @param organization The organization the team is in.
   * @param team The team in question.
   *
   * @returns The udpated team member.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(`:${UrlEndpoint.Member}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner
  )
  async update(
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @TeamMember() teamMember: TeamMemberEntity | undefined,
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @SubjectTeamMember() subjectTeamMember: TeamMemberEntity,
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity
  ): Promise<TeamMemberEntity> {
    this.logger.log(
      `Update team member request received for org member slug: ${
        subjectOrgMember.slug
      }, from org member slug: ${orgMember.slug}, in organization ID: ${
        organization.id
      }, in team ID: ${team.id}, with values: ${JSON.stringify(
        updateTeamMemberDto
      )}`
    );

    const { role } = updateTeamMemberDto;
    const updatedTeamMember = await this.teamMemberService.updateRole(
      subjectTeamMember,
      role,
      orgMember.role,
      teamMember?.role ?? null
    );
    this.logger.log(
      `Updated team member for org member slug: ${subjectOrgMember.slug}, in team ID: ${team.id}`
    );

    return updatedTeamMember;
  }

  /**
   * The API route for deleting a team member.
   *
   * @param orgMember The org member making the request.
   * @param teamMember The team member making the request, if applicable.
   * @param subjectOrgMember The org member being affected.
   * @param subjectTeamMember The team member being affected.
   * @param organization The organization the team is in.
   * @param team The team in question.
   *
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Delete(`:${UrlEndpoint.Member}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner
  )
  async delete(
    @OrgMember() orgMember: OrgMemberEntity,
    @TeamMember() teamMember: TeamMemberEntity | undefined,
    @SubjectOrgMember() subjectOrgMember: OrgMemberEntity,
    @SubjectTeamMember() subjectTeamMember: TeamMemberEntity,
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity
  ): Promise<void> {
    this.logger.log(
      `Delete team member request received for org member slug: ${subjectOrgMember.slug}, from org member slug: ${orgMember.slug}, in organization ID: ${organization.id}, in team ID: ${team.id}`
    );
    await this.teamMemberService.delete(
      subjectTeamMember,
      orgMember.role,
      teamMember?.role ?? null
    );
    this.logger.log(
      `Deleted team member for org member slug: ${subjectOrgMember.slug}, in team ID: ${team.id}`
    );
  }
}
