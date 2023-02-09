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
import {
  organizationName,
  OrgRoleEnum,
  Role,
  teamName,
  TeamRoleEnum,
  User,
} from '@newbee/api/shared/util';
import {
  CreateTeamDto,
  TeamService,
  UpdateTeamDto,
} from '@newbee/api/team/data-access';
import { create, team, teamVersion } from '@newbee/shared/data-access';

/**
 * The controller that interacts with `TeamEntity`.
 */
@Controller({ path: `:${organizationName}/${team}`, version: teamVersion })
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
   * @param organizationName The name of the organization the team will go in.
   *
   * @returns The newly created team.
   * @throws {BadRequestException} `teamNameTakenBadRequest`. If the team name is already taken in the organization.
   * @throws {NotFoundException} `organizationNameNotFound`, `orgMemberNotFound`. If the organization name cannot be found or the user does not exist in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(create)
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @User() user: UserEntity,
    @Param(organizationName) organizationName: string
  ): Promise<TeamEntity> {
    this.logger.log(
      `Create team request received from user ID: ${user.id}, for team name: ${createTeamDto.name}, in organization: ${organizationName}`
    );

    const organization = await this.organizationService.findOneByName(
      organizationName
    );
    const orgMember = await this.orgMemberService.findOneByUserAndOrg(
      user,
      organization
    );
    const team = await this.teamService.create(createTeamDto, orgMember);
    this.logger.log(`Team created with name: ${team.name}, ID: ${team.id}`);

    return team;
  }

  /**
   * The API route for getting a team.
   * Organization members, moderators, and owners should be allowed to access this endpoint.
   * No need for team permissions as team members should also be organization members.
   *
   * @param organizationName The name of the organization to look in for the team.
   * @param teamName The name of the team to look for.
   *
   * @returns The team associated with the name in the organization, if one exists.
   * @throws {NotFoundException} `organizationNameNotFound`, `teamNameNotFound`. If the organization or team name cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Get(`:${teamName}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(
    @Param(organizationName) organizationName: string,
    @Param(teamName) teamName: string
  ): Promise<TeamEntity> {
    this.logger.log(
      `Get organization request received for team name: ${teamName}, in organization: ${organizationName}`
    );

    const team = await this.getTeam(organizationName, teamName);
    this.logger.log(`Found team, name: ${teamName}, ID: ${team.id}`);

    return team;
  }

  /**
   * The API route for updating a team.
   * Organization moderators and owners, and team moderators and owners, should be allowed to access this endpoint.
   *
   * @param organizationName The name of the organization to look in.
   * @param teamName The name of the team to look for.
   * @param updateTeamDto The new values for the team.
   *
   * @returns The updated team, if it was updated successfully.
   * @throws {NotFoundException} `organizationNameNotFound`, `teamNameNotFound`. If the organization or team can't be found.
   * @throws {BadRequestException} `teamNameTakenBadRequest`. If the team's name is being updated and is already taken.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(`:${teamName}`)
  @Role(
    OrgRoleEnum.Moderator,
    OrgRoleEnum.Owner,
    TeamRoleEnum.Moderator,
    TeamRoleEnum.Owner
  )
  async update(
    @Param(organizationName) organizationName: string,
    @Param(teamName) teamName: string,
    @Body() updateTeamDto: UpdateTeamDto
  ): Promise<TeamEntity> {
    this.logger.log(
      `Update team request received for team name: ${teamName}, for organization: ${organizationName}, with values: ${JSON.stringify(
        updateTeamDto
      )}`
    );

    const team = await this.getTeam(organizationName, teamName);
    const updatedTeam = await this.teamService.update(team, updateTeamDto);
    this.logger.log(
      `Updated team, name: ${updatedTeam.name}, ID: ${updatedTeam.id}`
    );

    return updatedTeam;
  }

  /**
   * The API route for deleting a team.
   * Organization moderators and owners, and team owners, should be allowed to access this endpoint.
   *
   * @param organizationName The name of the organization to look in.
   * @param teamName The name of the team to look for in the organization.
   */
  @Delete(`:${teamName}`)
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner, TeamRoleEnum.Owner)
  async delete(
    @Param(organizationName) organizationName: string,
    @Param(teamName) teamName: string
  ): Promise<void> {
    this.logger.log(
      `Delete team request received for team name: ${teamName}, in organization: ${organizationName}`
    );
    const team = await this.getTeam(organizationName, teamName);
    await this.teamService.delete(team);
    this.logger.log(`Deleted team, name: ${teamName}, ID: ${team.id}`);
  }

  /**
   * Finds the team with the given name in the given organization.
   *
   * @param organizationName The name of the organization to look in.
   * @param teamName The name of the team to look for.
   *
   * @returns The associated team, if it exists.
   * @throws {NotFoundException} `organizationNameNotFound`, `teamNameNotFound`. If the organization or team name cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  private async getTeam(
    organizationName: string,
    teamName: string
  ): Promise<TeamEntity> {
    const organization = await this.organizationService.findOneByName(
      organizationName
    );
    return await this.teamService.findOneByName(organization, teamName);
  }
}
