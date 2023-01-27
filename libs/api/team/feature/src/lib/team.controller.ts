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
import { OrganizationService } from '@newbee/api/organization/data-access';
import { TeamEntity, UserEntity } from '@newbee/api/shared/data-access';
import { User } from '@newbee/api/shared/util';
import {
  CreateTeamDto,
  TeamService,
  UpdateTeamDto,
} from '@newbee/api/team/data-access';
import { UserOrganizationService } from '@newbee/api/user-organization/data-access';
import { create, team, teamVersion } from '@newbee/shared/data-access';

/**
 * The controller that interacts with `TeamEntity`.
 */
@Controller({ path: `:organization/${team}`, version: teamVersion })
export class TeamController {
  private readonly logger = new Logger(TeamController.name);

  constructor(
    private readonly teamService: TeamService,
    private readonly organizationService: OrganizationService,
    private readonly userOrganizationService: UserOrganizationService
  ) {}

  /**
   * The API route for creating a team.
   *
   * @param createTeamDto The information necessary to create a team.
   * @param user The user that sent the request and will become the owner of the team.
   * @param organizationName The name of the organization the team will go in.
   *
   * @returns The newly created team.
   * @throws {BadRequestException} `organizationNameNotFound`, `userOrganizationNotFound`, `teamNameTakenBadRequest`. If the organization name cannot be found, the user does not exist in the organization, or the team name is already taken in the organization.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(create)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @User() user: UserEntity,
    @Param('organization') organizationName: string
  ): Promise<TeamEntity> {
    // TODO: implement access controls here
    this.logger.log(
      `Create team request received from user ID: ${user.id}, for team name: ${createTeamDto.name}, in organization: ${organizationName}`
    );

    const organization = await this.organizationService.findOneByName(
      organizationName
    );
    const userOrganization =
      await this.userOrganizationService.findOneByUserAndOrganization(
        user,
        organization
      );
    const team = await this.teamService.create(createTeamDto, userOrganization);
    this.logger.log(`Team created with name: ${team.name}, ID: ${team.id}`);

    return team;
  }

  /**
   * The API route for getting a team.
   *
   * @param organizationName The name of the organization to look in for the team.
   * @param teamName The name of the team to look for.
   *
   * @returns The team associated with the name in the organization, if one exists.
   * @throws {NotFoundException} `organizationNameNotFound`, `teamNameNotFound`. If the organization or team name cannot be found.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Get(':name')
  async get(
    @Param('organization') organizationName: string,
    @Param('name') teamName: string
  ): Promise<TeamEntity> {
    // TODO: implement access controls here
    this.logger.log(
      `Get organization request received for team name: ${teamName}, in organization: ${organizationName}`
    );

    const team = await this.getTeam(organizationName, teamName);
    this.logger.log(`Found team, name: ${teamName}, ID: ${team.id}`);

    return team;
  }

  /**
   * The API route for updating a team.
   *
   * @param organizationName The name of the organization to look in.
   * @param teamName The name of the team to look for.
   * @param updateTeamDto The new values for the team.
   *
   * @returns The udpated team, if it was updated successfully.
   * @throws {NotFoundException} `organizationNameNotFound`, `teamNameNotFound`. If the organization or team can't be found.
   * @throws {BadRequestException} `organizationNameTakenBadRequest`. If the team's name is being updated and is already taken.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Patch(':name')
  async update(
    @Param('organization') organizationName: string,
    @Param('name') teamName: string,
    @Body() updateTeamDto: UpdateTeamDto
  ): Promise<TeamEntity> {
    // TODO: implement access controls here
    this.logger.log(
      `Update team request received for team name: ${teamName}, for organization: ${organizationName}, with values: ${JSON.stringify(
        updateTeamDto
      )}`
    );

    const team = await this.getTeam(organizationName, teamName);
    const updatedTeam = await this.teamService.update(team, updateTeamDto);
    this.logger.log(`Updated team, name: ${teamName}, ID: ${updatedTeam.id}`);

    return updatedTeam;
  }

  /**
   * The API route for deleting a team.
   *
   * @param organizationName The name of the organization to look in.
   * @param teamName The name of the team to look for in the organization.
   */
  @Delete(':name')
  async delete(
    @Param('organization') organizationName: string,
    @Param('name') teamName: string
  ): Promise<void> {
    // TODO: implement access controls here
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
