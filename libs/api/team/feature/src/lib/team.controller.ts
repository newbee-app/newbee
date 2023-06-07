import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
} from '@nestjs/common';
import {
  OrganizationEntity,
  OrgMemberEntity,
  TeamEntity,
} from '@newbee/api/shared/data-access';
import { Organization, OrgMember, Role, Team } from '@newbee/api/shared/util';
import {
  CreateTeamDto,
  TeamService,
  UpdateTeamDto,
} from '@newbee/api/team/data-access';
import { teamVersion, UrlEndpoint } from '@newbee/shared/data-access';
import { OrgRoleEnum, TeamRoleEnum } from '@newbee/shared/util';

/**
 * The controller that interacts with `TeamEntity`.
 */
@Controller({
  path: `${UrlEndpoint.Organization}/:${UrlEndpoint.Organization}/${UrlEndpoint.Team}`,
  version: teamVersion,
})
export class TeamController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(TeamController.name);

  constructor(private readonly teamService: TeamService) {}

  /**
   * The API route for creating a team.
   * Organization moderators and owners should be allowed to access this endpoint.
   *
   * @param createTeamDto The information necessary to create a team.
   * @param user The user that sent the request and will become the owner of the team.
   * @param organization The  organization the team will go in.
   *
   * @returns The newly created team.
   * @throws {BadRequestException} `teamSlugTakenBadRequest`. If the team slug is already taken in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post()
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity
  ): Promise<TeamEntity> {
    this.logger.log(
      `Create team request received from org member slug: ${
        orgMember.slug
      }, in organization ID: ${organization.id}, with values: ${JSON.stringify(
        createTeamDto
      )}`
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
   * @param organization The organization to look in for the team.
   * @param team The team we were looking for.
   *
   * @returns The team associated with the slug in the organization, if one exists.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Get(`:${UrlEndpoint.Team}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity
  ): Promise<TeamEntity> {
    this.logger.log(
      `Get organization request received for team slug: ${team.slug}, in organization ID: ${organization.id}`
    );
    this.logger.log(`Found team, slug: ${team.slug}, ID: ${team.id}`);
    return team;
  }

  /**
   * The API route for updating a team.
   * Organization moderators and owners, and team moderators and owners, should be allowed to access this endpoint.
   *
   * @param updateTeamDto The new values for the team.
   * @param organization The organization to look in.
   * @param team The team we were looking for.
   *
   * @returns The updated team, if it was updated successfully.
   * @throws {BadRequestException} `teamSlugTakenBadRequest`. If the team's slug is being updated and is already taken.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(`:${UrlEndpoint.Team}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner
  )
  async update(
    @Body() updateTeamDto: UpdateTeamDto,
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity
  ): Promise<TeamEntity> {
    this.logger.log(
      `Update team request received for team slug: ${
        team.slug
      }, for organization ID: ${organization.id}, with values: ${JSON.stringify(
        updateTeamDto
      )}`
    );
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
   * @param organization The organization to look in.
   * @param team The team we were looking for.
   *
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Delete(`:${UrlEndpoint.Team}`)
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner, TeamRoleEnum.Owner)
  async delete(
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity
  ): Promise<void> {
    this.logger.log(
      `Delete team request received for team slug: ${team.slug}, in organization ID: ${organization.id}`
    );
    await this.teamService.delete(team);
    this.logger.log(`Deleted team, slug: ${team.slug}, ID: ${team.id}`);
  }
}
