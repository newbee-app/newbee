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
import {
  CreateOrganizationDto,
  OrganizationService,
  UpdateOrganizationDto,
} from '@newbee/api/organization/data-access';
import { OrganizationEntity, UserEntity } from '@newbee/api/shared/data-access';
import { OrgRoleEnum, Role, User } from '@newbee/api/shared/util';
import { organization, organizationVersion } from '@newbee/shared/data-access';

/**
 * The controller that interacts with `OrganizationEntity`.
 */
@Controller({ path: organization, version: organizationVersion })
export class OrganizationController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(OrganizationController.name);

  constructor(private readonly organizationService: OrganizationService) {}

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
    this.logger.log(`Organization created: ${JSON.stringify(organization)}`);

    return organization;
  }

  /**
   * The API route for getting an organization.
   * Members, moderators, and owners should be allowed to access this endpoint.
   *
   * @param slug The slug of the organization to get.
   *
   * @returns The organization associated with the slug, if one exists.
   * @throws {NotFoundException} `organizationSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Get(`:${organization}`)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(@Param(organization) slug: string): Promise<OrganizationEntity> {
    this.logger.log(
      `Get organization request received for organization slug: ${slug}`
    );

    const organization = await this.organizationService.findOneBySlug(slug);
    this.logger.log(
      `Found organization, slug: ${slug}, ID: ${organization.id}`
    );

    return organization;
  }

  /**
   * The API route for updating an organization.
   * Moderators and owners should be allowed to access this endpoint.
   *
   * @param slug The slug of the organization to update.
   * @param updateOrganizationDto The new information for the organization.
   *
   * @returns The updated organization, if it was updated successfully.
   * @throws {NotFoundException} `organizationSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Patch(`:${organization}`)
  @Role(OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async update(
    @Param(organization) slug: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<OrganizationEntity> {
    this.logger.log(
      `Update organization request received for organization slug: ${slug}, with values: ${JSON.stringify(
        updateOrganizationDto
      )}`
    );

    const organization = await this.organizationService.findOneBySlug(slug);
    const updatedOrganization = await this.organizationService.update(
      organization,
      updateOrganizationDto
    );
    this.logger.log(
      `Updated organization, slug: ${updatedOrganization.slug}, ID: ${updatedOrganization.id}`
    );

    return updatedOrganization;
  }

  /**
   * The API route for deleting an organization.
   * Owners should be allowed to access this endpoint.
   *
   * @param slug The slug of the organization to delete.
   *
   * @throws {NotFoundException} `organizationSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Delete(`:${organization}`)
  @Role(OrgRoleEnum.Owner)
  async delete(@Param(organization) slug: string): Promise<void> {
    this.logger.log(`Delete organization request received for slug: ${slug}`);
    const organization = await this.organizationService.findOneBySlug(slug);
    await this.organizationService.delete(organization);
    this.logger.log(
      `Deleted organization, slug: ${slug}, ID: ${organization.id}`
    );
  }
}
