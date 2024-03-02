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
import { OrganizationService } from '@newbee/api/organization/data-access';
import { SearchService } from '@newbee/api/search/data-access';
import {
  EntityService,
  OrgMemberEntity,
  OrganizationEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  OrgMember,
  Organization,
  Role,
  User,
  generateUniqueSlug,
} from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import {
  CreateOrganizationDto,
  GenerateSlugDto,
  GeneratedSlugDto,
  Keyword,
  OrgAndMemberDto,
  OrgSearchDto,
  OrgSearchResultsDto,
  OrgSuggestDto,
  SlugDto,
  SlugTakenDto,
  SuggestResultsDto,
  UpdateOrganizationDto,
  apiRoles,
} from '@newbee/shared/util';

/**
 * The controller that interacts with `OrganizationEntity`.
 */
@Controller({ path: Keyword.Organization, version: apiVersion.org })
export class OrganizationController {
  private readonly logger = new Logger(OrganizationController.name);

  constructor(
    private readonly entityService: EntityService,
    private readonly organizationService: OrganizationService,
    private readonly searchService: SearchService,
  ) {}

  /**
   * The API route for creating an organization.
   *
   * @param createOrganizationDto The information necessary to create an organization.
   * @param user The user that sent the request and will become the owner of the organization.
   *
   * @returns The newly created organization.
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @User() user: UserEntity,
  ): Promise<OrganizationEntity> {
    this.logger.log(
      `Create organization request received from user ID: ${
        user.id
      }, with values: ${JSON.stringify(createOrganizationDto)}`,
    );
    const organization = await this.organizationService.create(
      createOrganizationDto,
      user,
    );
    this.logger.log(
      `Organization created with ID: ${organization.id}, ${JSON.stringify(
        organization,
      )}`,
    );
    return organization;
  }

  /**
   * The API route for checking whether an org slug has been taken.
   *
   * @param slugDto The org slug to check.
   *
   * @returns `true` if the org slug is taken, `false` if not.
   */
  @Get(Keyword.CheckSlug)
  async checkSlug(@Query() slugDto: SlugDto): Promise<SlugTakenDto> {
    const { slug } = slugDto;
    this.logger.log(
      `Check organization slug request received for slug: ${slug}`,
    );
    const hasSlug = await this.organizationService.hasOneBySlug(slug);
    this.logger.log(`Organization slug ${slug} taken: ${hasSlug}`);
    return new SlugTakenDto(hasSlug);
  }

  /**
   * The API route for generating a new org slug based on a base string.
   *
   * @param generateSlugDto The base string to use.
   *
   * @returns A unique org slug suitable for use.
   */
  @Get(Keyword.GenerateSlug)
  async generateSlug(
    @Query() generateSlugDto: GenerateSlugDto,
  ): Promise<GeneratedSlugDto> {
    const { base } = generateSlugDto;
    this.logger.log(`New organization slug request received for base: ${base}`);
    const slug = await generateUniqueSlug(
      async (slugToTry) =>
        !(await this.organizationService.hasOneBySlug(slugToTry)),
      base,
    );
    this.logger.log(`Organization slug ${slug} generated for base ${base}`);
    return new GeneratedSlugDto(slug);
  }

  /**
   * The API route for getting an organization.
   * Members, moderators, and owners should be allowed to access this endpoint.
   *
   * @param organization The organization to get.
   *
   * @returns The organization associated with the slug, if one exists.
   */
  @Get(`:${Keyword.Organization}`)
  @Role(apiRoles.org.get)
  async get(
    @Organization() organization: OrganizationEntity,
    @OrgMember() orgMember: OrgMemberEntity,
  ): Promise<OrgAndMemberDto> {
    const { id, slug } = organization;
    this.logger.log(
      `Get organization request received for organization slug: ${slug}`,
    );
    this.logger.log(`Found organization, slug: ${slug}, ID: ${id}`);
    return new OrgAndMemberDto(
      await this.entityService.createOrgTeamsMembers(organization),
      await this.entityService.createOrgMemberNoUserOrg(orgMember),
    );
  }

  /**
   * The API route for updating an organization.
   * Moderators and owners should be allowed to access this endpoint.
   *
   * @param organization The organization to update.
   * @param updateOrganizationDto The new information for the organization.
   *
   * @returns The updated organization, if it was updated successfully.
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  @Patch(`:${Keyword.Organization}`)
  @Role(apiRoles.org.update)
  async update(
    @Organization() organization: OrganizationEntity,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationEntity> {
    const { id, slug } = organization;
    this.logger.log(
      `Update organization request received for organization slug: ${slug}, with values: ${JSON.stringify(
        updateOrganizationDto,
      )}`,
    );
    organization = await this.organizationService.update(
      organization,
      updateOrganizationDto,
    );
    this.logger.log(`Updated organization, slug: ${slug}, ID: ${id}`);
    return organization;
  }

  /**
   * The API route for deleting an organization.
   * Owners should be allowed to access this endpoint.
   *
   * @param organization The organization to delete.
   */
  @Delete(`:${Keyword.Organization}`)
  @Role(apiRoles.org.delete)
  async delete(
    @Organization() organization: OrganizationEntity,
  ): Promise<void> {
    const { id, slug } = organization;
    this.logger.log(`Delete organization request received for slug: ${slug}`);
    await this.organizationService.delete(organization);
    this.logger.log(`Deleted organization, slug: ${slug}, ID: ${id}`);
  }

  /**
   * The API route for making query suggestions in an org.
   *
   * @param orgSuggestDto The information for generating a suggestion.
   * @param organization The organization to look in.
   *
   * @returns The suggestions as an array of strings.
   */
  @Get(`:${Keyword.Organization}/${Keyword.Search}`)
  @Role(apiRoles.org.suggest)
  async suggest(
    @Query() orgSuggestDto: OrgSuggestDto,
    @Organization() organization: OrganizationEntity,
  ): Promise<SuggestResultsDto> {
    this.logger.log(
      `Suggest request received in organization ID ${
        organization.id
      }: ${JSON.stringify(orgSuggestDto)}`,
    );
    const result = await this.searchService.orgSuggest(
      organization,
      orgSuggestDto,
    );
    this.logger.log(
      `Suggest results generated in organization ID ${
        organization.id
      }: ${JSON.stringify(result)}`,
    );
    return result;
  }

  /**
   * The API route for searching an org.
   *
   * @param orgSearchDto The query information.
   * @param organization The organization to search in.
   *
   * @returns The results of the search.
   */
  @Get(`:${Keyword.Organization}/${Keyword.Search}`)
  @Role(apiRoles.org.search)
  async search(
    @Query() orgSearchDto: OrgSearchDto,
    @Organization() organization: OrganizationEntity,
  ): Promise<OrgSearchResultsDto> {
    this.logger.log(
      `Search request received in organization ID ${
        organization.id
      }: ${JSON.stringify(orgSearchDto)}`,
    );
    const result = await this.searchService.orgSearch(
      organization,
      orgSearchDto,
    );
    this.logger.log(
      `Search results generated in organization ID ${
        organization.id
      }: ${JSON.stringify(result)}`,
    );
    return result;
  }
}
