import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrgMemberService } from '@newbee/api/org-member/data-access';
import { OrganizationService } from '@newbee/api/organization/data-access';
import { TeamEntity, UserEntity } from '@newbee/api/shared/data-access';
import { Role, User } from '@newbee/api/shared/util';
import {
  CreateTeamDto,
  TeamService,
  UpdateTeamDto,
} from '@newbee/api/team/data-access';
import { organization, team, teamVersion } from '@newbee/shared/data-access';
import { OrgRoleEnum, TeamRoleEnum } from '@newbee/shared/util';

/**
 * The controller that interacts with `TeamEntity`.
 */
@Controller({
  path: `${organization}/:${organization}/${team}`,
  version: teamVersion,
})
export class TeamController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(TeamController.name);

  constructor(
    private readonly teamService: TeamService,
    private readonly organizationService: OrganizationService,
    private readonly orgMemberService: OrgMemberService
  ) {}

  /**
   * The API route for creating a team.
   * Organization moderators and owners should be allowed to access this endpoint.
   *
   * @param createTeamDto The information necessary to create a team.
   * @param user The user that sent the request and will become the owner of the team.
   * @param organizationSlug The slug of the organization the team will go in.
   *
   * @returns The newly created team.
   * @throws {BadRequestException} `teamSlugTakenBadRequest`. If the team slug is already taken in the organization.
   * @throws {NotFoundException} `organizationSlugNotFound`, `orgMemberNotFound`. If the organization slug cannot be found or the user does not exist in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post()
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @User() user: UserEntity,
    @Param(organization) organizationSlug: string
  ): Promise<TeamEntity> {
    this.logger.log(
      `Create team request received from user ID: ${
        user.id
      }, in organization: ${organizationSlug}, with values: ${JSON.stringify(
        createTeamDto
      )}`
    );

    const organization = await this.organizationService.findOneBySlug(
      organizationSlug
    );
    const orgMember = await this.orgMemberService.findOneByUserAndOrg(
      user,
      organization
    );
    const team = await this.teamService.create(createTeamDto, orgMember);
    this.logger.log(
      `Team created with ID: ${team.id}, ${JSON.stringify(team)}`
    );

    return team;
  }

  /**
   * The API route for getting a team.
   * Organization members, moderators, and owners should be allowed to access this endpoint.
   * No need for team permissions as team members should also be organization members.
   *
   * @param organizationSlug The slug of the organization to look in for the team.
   * @param teamSlug The slug of the team to look for.
   *
   * @returns The team associated with the slug in the organization, if one exists.
   * @throws {NotFoundException} `organizationSlugNotFound`, `teamSlugNotFound`. If the organization or team slug cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Get(`:${team}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(
    @Param(organization) organizationSlug: string,
    @Param(team) teamSlug: string
  ): Promise<TeamEntity> {
    this.logger.log(
      `Get organization request received for team slug: ${teamSlug}, in organization: ${organizationSlug}`
    );

    const team = await this.getTeam(organizationSlug, teamSlug);
    this.logger.log(`Found team, slug: ${teamSlug}, ID: ${team.id}`);

    return team;
  }

  /**
   * The API route for updating a team.
   * Organization moderators and owners, and team moderators and owners, should be allowed to access this endpoint.
   *
   * @param organizationSlug The slug of the organization to look in.
   * @param teamSlug The slug of the team to look for.
   * @param updateTeamDto The new values for the team.
   *
   * @returns The updated team, if it was updated successfully.
   * @throws {NotFoundException} `organizationSlugNotFound`, `teamSlugNotFound`. If the organization or team can't be found.
   * @throws {BadRequestException} `teamSlugTakenBadRequest`. If the team's slug is being updated and is already taken.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(`:${team}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner
  )
  async update(
    @Param(organization) organizationSlug: string,
    @Param(team) teamSlug: string,
    @Body() updateTeamDto: UpdateTeamDto
  ): Promise<TeamEntity> {
    this.logger.log(
      `Update team request received for team slug: ${teamSlug}, for organization: ${organizationSlug}, with values: ${JSON.stringify(
        updateTeamDto
      )}`
    );

    const team = await this.getTeam(organizationSlug, teamSlug);
    const updatedTeam = await this.teamService.update(team, updateTeamDto);
    this.logger.log(
      `Updated team, slug: ${updatedTeam.slug}, ID: ${updatedTeam.id}`
    );

    return updatedTeam;
  }

  /**
   * The API route for deleting a team.
   * Organization moderators and owners, and team owners, should be allowed to access this endpoint.
   *
   * @param organizationSlug The slug of the organization to look in.
   * @param teamSlug The slug of the team to look for in the organization.
   *
   * @throws {NotFoundException} `organizationSlugNotFound`, `teamSlugNotFound`. If the organization or team slug cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Delete(`:${team}`)
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner, TeamRoleEnum.Owner)
  async delete(
    @Param(organization) organizationSlug: string,
    @Param(team) teamSlug: string
  ): Promise<void> {
    this.logger.log(
      `Delete team request received for team slug: ${teamSlug}, in organization: ${organizationSlug}`
    );
    const team = await this.getTeam(organizationSlug, teamSlug);
    await this.teamService.delete(team);
    this.logger.log(`Deleted team, slug: ${teamSlug}, ID: ${team.id}`);
  }

  /**
   * Finds the team with the given slug in the given organization.
   *
   * @param organizationSlug The slug of the organization to look in.
   * @param teamSlug The slug of the team to look for.
   *
   * @returns The associated team, if it exists.
   * @throws {NotFoundException} `organizationSlugNotFound`, `teamSlugNotFound`. If the organization or team slug cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  private async getTeam(
    organizationSlug: string,
    teamSlug: string
  ): Promise<TeamEntity> {
    const organization = await this.organizationService.findOneBySlug(
      organizationSlug
    );
    return await this.teamService.findOneBySlug(organization, teamSlug);
  }
}
