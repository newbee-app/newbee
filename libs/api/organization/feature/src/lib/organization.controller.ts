import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateOrganizationDto,
  OrganizationGuard,
  OrganizationService,
  UpdateOrganizationDto,
} from '@newbee/api/organization/data-access';
import { OrganizationEntity, UserEntity } from '@newbee/api/shared/data-access';
import { Organization, Role, User } from '@newbee/api/shared/util';
import { organization, organizationVersion } from '@newbee/shared/data-access';
import { OrgRoleEnum } from '@newbee/shared/util';

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
    this.logger.log(
      `Organization created with ID: ${organization.id}, ${JSON.stringify(
        organization
      )}`
    );

    return organization;
  }

  /**
   * The API route for getting an organization.
   * Members, moderators, and owners should be allowed to access this endpoint.
   *
   * @param organization The organization to get.
   *
   * @returns The organization associated with the slug, if one exists.
   */
  @Get(`:${organization}`)
  @UseGuards(OrganizationGuard)
  @Role(OrgRoleEnum.Member, OrgRoleEnum.Moderator, OrgRoleEnum.Owner)
  async get(
    @Organization() organization: OrganizationEntity
  ): Promise<OrganizationEntity> {
    const { id, slug } = organization;
    this.logger.log(
      `Get organization request received for organization slug: ${slug}`
    );
    this.logger.log(`Found organization, slug: ${slug}, ID: ${id}`);

    return organization;
  }

  /**
   * The API route for updating an organization.
   * Moderators and owners should be allowed to access this endpoint.
   *
   * @param organization The organization to update.
   * @param updateOrganizationDto The new information for the organization.
   *
   * @returns The updated organization, if it was updated successfully.
   * @throws {NotFoundException} `organizationSlugNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {BadRequestException} `organizationSlugTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Patch(`:${organization}`)
  @UseGuards(OrganizationGuard)
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
  @Delete(`:${organization}`)
  @UseGuards(OrganizationGuard)
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
