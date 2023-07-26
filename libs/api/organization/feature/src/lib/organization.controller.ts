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
  CreateOrganizationDto,
  OrganizationService,
  UpdateOrganizationDto,
} from '@newbee/api/organization/data-access';
import {
  EntityService,
  GenerateSlugDto,
  OrganizationEntity,
  OrgMemberEntity,
  SlugDto,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  generateUniqueSlug,
  Organization,
  OrgMember,
  Role,
  User,
} from '@newbee/api/shared/util';
import {
  apiVersion,
  BaseGeneratedSlugDto,
  BaseOrgAndMemberDto,
  BaseSlugTakenDto,
} from '@newbee/shared/data-access';
import { Keyword, OrgRoleEnum } from '@newbee/shared/util';

/**
 * The controller that interacts with `OrganizationEntity`.
 */
@Controller({ path: Keyword.Organization, version: apiVersion.organization })
export class OrganizationController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(OrganizationController.name);

  constructor(
    private readonly organizationService: OrganizationService,
    private readonly entityService: EntityService
  ) {}

  /**
   * The API route for creating an organization.
   *
   * @param createOrganizationDto The information necessary to create an organization.
   * @param user The user that sent the request and will become the owner of the organization.
   *
   * @returns The newly created organization.
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @User() user: UserEntity
  ): Promise<OrganizationEntity> {
    this.logger.log(
      `Create organization request received from user ID: ${
        user.id
      }, with values: ${JSON.stringify(createOrganizationDto)}`
    );
    const organization = await this.organizationService.create(
      createOrganizationDto,
      user
    );
    this.logger.log(
      `Organization created with ID: ${organization.id}, ${JSON.stringify(
        organization
      )}`
    );
    return organization;
  }

  /**
   * The API route for checking whether an org slug has been taken.
   *
   * @param checkSlugDto The org slug to check.
   *
   * @returns `true` if the org slug is taken, `false` if not.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  @Get(Keyword.CheckSlug)
  async checkSlug(@Query() checkSlugDto: SlugDto): Promise<BaseSlugTakenDto> {
    const { slug } = checkSlugDto;
    this.logger.log(
      `Check organization slug request received for slug: ${slug}`
    );
    const hasSlug = await this.organizationService.hasOneBySlug(slug);
    this.logger.log(`Organization slug ${slug} taken: ${hasSlug}`);

    return { slugTaken: hasSlug };
  }

  /**
   * The API route for generating a new org slug based on a base string.
   *
   * @param generateSlugDto The base string to use.
   *
   * @returns A unique org slug suitable for use.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  @Get(Keyword.GenerateSlug)
  async generateSlug(
    @Query() generateSlugDto: GenerateSlugDto
  ): Promise<BaseGeneratedSlugDto> {
    const { base } = generateSlugDto;
    this.logger.log(`New organization slug request received for base: ${base}`);
    const slug = await generateUniqueSlug(
      async (slugToTry) =>
        !(await this.organizationService.hasOneBySlug(slugToTry)),
      base
    );
    this.logger.log(`Organization slug ${slug} generated for base ${base}`);

    return { generatedSlug: slug };
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
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(
    @Organization() organization: OrganizationEntity,
    @OrgMember() orgMember: OrgMemberEntity
  ): Promise<BaseOrgAndMemberDto> {
    const { id, slug } = organization;
    this.logger.log(
      `Get organization request received for organization slug: ${slug}`
    );
    this.logger.log(`Found organization, slug: ${slug}, ID: ${id}`);
    return {
      organization,
      orgMember: await this.entityService.createOrgMemberNoUserOrg(orgMember),
    };
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
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Patch(`:${Keyword.Organization}`)
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async update(
    @Organization() organization: OrganizationEntity,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<OrganizationEntity> {
    const { id, slug } = organization;
    this.logger.log(
      `Update organization request received for organization slug: ${slug}, with values: ${JSON.stringify(
        updateOrganizationDto
      )}`
    );

    const updatedOrganization = await this.organizationService.update(
      organization,
      updateOrganizationDto
    );
    this.logger.log(`Updated organization, slug: ${slug}, ID: ${id}`);

    return updatedOrganization;
  }

  /**
   * The API route for deleting an organization.
   * Owners should be allowed to access this endpoint.
   *
   * @param organization The organization to delete.
   */
  @Delete(`:${Keyword.Organization}`)
  @Role(OrgRoleEnum.Owner)
  async delete(
    @Organization() organization: OrganizationEntity
  ): Promise<void> {
    const { id, slug } = organization;
    this.logger.log(`Delete organization request received for slug: ${slug}`);
    await this.organizationService.delete(organization);
    this.logger.log(`Deleted organization, slug: ${slug}, ID: ${id}`);
  }
}
