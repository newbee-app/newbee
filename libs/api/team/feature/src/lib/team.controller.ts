import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  DocEntity,
  EntityService,
  GenerateSlugDto,
  OffsetAndLimitDto,
  OrgMemberEntity,
  OrganizationEntity,
  QnaEntity,
  SlugDto,
  TeamEntity,
  TeamMemberEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  OrgMember,
  Organization,
  Role,
  Team,
  TeamMember,
  User,
  generateUniqueSlug,
} from '@newbee/api/shared/util';
import {
  CreateTeamDto,
  TeamService,
  UpdateTeamDto,
} from '@newbee/api/team/data-access';
import { apiVersion } from '@newbee/shared/data-access';
import {
  BaseGeneratedSlugDto,
  BaseSlugTakenDto,
  BaseTeamAndMemberDto,
  DocQueryResult,
  Keyword,
  PaginatedResults,
  QnaQueryResult,
  apiRoles,
} from '@newbee/shared/util';

/**
 * The controller that interacts with `TeamEntity`.
 */
@Controller({
  path: `${Keyword.Organization}/:${Keyword.Organization}/${Keyword.Team}`,
  version: apiVersion.team,
})
export class TeamController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(TeamController.name);

  constructor(
    private readonly teamService: TeamService,
    private readonly entityService: EntityService,
  ) {}

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
  @Role(apiRoles.team.create)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @OrgMember() orgMember: OrgMemberEntity,
    @Organization() organization: OrganizationEntity,
  ): Promise<TeamEntity> {
    this.logger.log(
      `Create team request received from org member slug: ${
        orgMember.slug
      }, in organization ID: ${organization.id}, with values: ${JSON.stringify(
        createTeamDto,
      )}`,
    );
    const team = await this.teamService.create(createTeamDto, orgMember);
    this.logger.log(
      `Team created with ID: ${team.id}, ${JSON.stringify(team)}`,
    );
    return team;
  }

  /**
   * The API route for checking whether a team slug has been taken in an org.
   *
   * @param checkSlugDto The team slug to check.
   * @param organization The organization to check in.
   * @param user The user making the request.
   *
   * @returns `true` if the org slug is taken, `false` otherwise.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  @Get(Keyword.CheckSlug)
  @Role(apiRoles.team.checkSlug)
  async checkSlug(
    @Query() checkSlugDto: SlugDto,
    @Organization() organization: OrganizationEntity,
    @User() user: UserEntity,
  ): Promise<BaseSlugTakenDto> {
    const { slug } = checkSlugDto;
    this.logger.log(
      `Check team slug request received for slug: ${slug}, in org ID: ${organization.id}, by user ID: ${user.id}`,
    );
    const hasSlug = await this.teamService.hasOneBySlug(organization, slug);
    this.logger.log(`Team slug ${slug} taken: ${hasSlug}`);

    return { slugTaken: hasSlug };
  }

  /**
   * The API route for generating a new team slug based on a base string.
   *
   * @param generateSlugDto The base string to use.
   * @param organization The organization the team will be in.
   * @param user The user making the request.
   *
   * @returns A unique team slug suitable fo ruse.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  @Get(Keyword.GenerateSlug)
  @Role(apiRoles.team.generateSlug)
  async generateSlug(
    @Query() generateSlugDto: GenerateSlugDto,
    @Organization() organization: OrganizationEntity,
    @User() user: UserEntity,
  ): Promise<BaseGeneratedSlugDto> {
    const { base } = generateSlugDto;
    this.logger.log(
      `Genereate team slug request received for base: ${base}, in organization ID: ${organization.id}, by user ID: ${user.id}`,
    );
    const slug = await generateUniqueSlug(
      async (slugToTry) =>
        !(await this.teamService.hasOneBySlug(organization, slugToTry)),
      base,
    );
    this.logger.log(
      `Team slug ${slug} generated for base ${base}, in organization ID: ${organization.id}, by user ID: ${user.id}`,
    );

    return { generatedSlug: slug };
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
  @Get(`:${Keyword.Team}`)
  @Role(apiRoles.team.get)
  async get(
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity,
    @TeamMember() teamMember: TeamMemberEntity | undefined,
  ): Promise<BaseTeamAndMemberDto> {
    this.logger.log(
      `Get team request received for team slug: ${team.slug}, in organization ID: ${organization.id}`,
    );
    this.logger.log(`Found team, slug: ${team.slug}, ID: ${team.id}`);
    return {
      team: await this.entityService.createTeamNoOrg(team),
      teamMember: teamMember ?? null,
    };
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
  @Patch(`:${Keyword.Team}`)
  @Role(apiRoles.team.update)
  async update(
    @Body() updateTeamDto: UpdateTeamDto,
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity,
  ): Promise<TeamEntity> {
    this.logger.log(
      `Update team request received for team slug: ${
        team.slug
      }, for organization ID: ${organization.id}, with values: ${JSON.stringify(
        updateTeamDto,
      )}`,
    );
    const updatedTeam = await this.teamService.update(team, updateTeamDto);
    this.logger.log(
      `Updated team, slug: ${updatedTeam.slug}, ID: ${updatedTeam.id}`,
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
  @Delete(`:${Keyword.Team}`)
  @Role(apiRoles.team.delete)
  async delete(
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity,
  ): Promise<void> {
    this.logger.log(
      `Delete team request received for team slug: ${team.slug}, in organization ID: ${organization.id}`,
    );
    await this.teamService.delete(team);
    this.logger.log(`Deleted team, slug: ${team.slug}, ID: ${team.id}`);
  }

  /**
   * The API route for getting paginated results of all the docs in a team.
   *
   * @param offsetAndLimitDto The offset and limit for the pagination.
   * @param organization The organization to look in.
   * @param team The team to look in.
   *
   * @returns The result containing the retrieved docs, the total number of docs in the team, and the offset we retrieved.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Get(`:${Keyword.Team}/${Keyword.Doc}`)
  @Role(apiRoles.team.getAllDocs)
  async getAllDocs(
    @Query() offsetAndLimitDto: OffsetAndLimitDto,
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity,
  ): Promise<PaginatedResults<DocQueryResult>> {
    const { offset, limit } = offsetAndLimitDto;
    this.logger.log(
      `Get all docs request received for team slug: ${team.slug}, in organization ID: ${organization.id}, with offset: ${offset} and limit: ${limit}`,
    );

    const [docs, total] = await this.entityService.findPostsByOrgAndCount(
      DocEntity,
      offsetAndLimitDto,
      organization,
      { team },
    );
    this.logger.log(
      `Got docs for team slug: ${team.slug}, in organization ID: ${organization.id}, total count: ${total}`,
    );

    return {
      ...offsetAndLimitDto,
      total,
      results: await this.entityService.createDocQueryResults(docs),
    };
  }

  /**
   * The API route for getting paginated results of all the qnas in a team.
   *
   * @param offsetAndLimitDto The offset and limit for the pagination.
   * @param organization The organization to look in.
   * @param team The team to look in.
   *
   * @returns The result containing the retrieved qnas, the total number of qnas in the team, and the offset we retrieved.
   * @throws {InternalServerErrorException} `internalServerError`. For any error.
   */
  @Get(`:${Keyword.Team}/${Keyword.Qna}`)
  @Role(apiRoles.team.getAllQnas)
  async getAllQnas(
    @Query() offsetAndLimitDto: OffsetAndLimitDto,
    @Organization() organization: OrganizationEntity,
    @Team() team: TeamEntity,
  ): Promise<PaginatedResults<QnaQueryResult>> {
    const { offset, limit } = offsetAndLimitDto;
    this.logger.log(
      `Get all qnas request received for team slug: ${team.slug}, in organization ID: ${organization.id}, with offset: ${offset} and limit: ${limit}`,
    );

    const [qnas, total] = await this.entityService.findPostsByOrgAndCount(
      QnaEntity,
      offsetAndLimitDto,
      organization,
      { team },
    );
    this.logger.log(
      `Got qnas for team slug: ${team.slug}, in organization ID: ${organization.id}, total count: ${total}`,
    );

    return {
      ...offsetAndLimitDto,
      total,
      results: await this.entityService.createQnaQueryResults(qnas),
    };
  }
}
