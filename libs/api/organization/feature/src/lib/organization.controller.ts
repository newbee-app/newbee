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
import { User } from '@newbee/api/shared/util';
import {
  create,
  organization,
  organizationVersion,
} from '@newbee/shared/data-access';

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
   * @throws {BadRequestException} `organizationNameTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Post(create)
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
      `Organization created with name: ${organization.name}, ID: ${organization.id}`
    );

    return organization;
  }

  /**
   * The API route for getting an organization.
   *
   * @param name The name of the organization to get.
   *
   * @returns The organization associated with the name, if one exists.
   * @throws {NotFoundException} `organizationNameNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Get(':name')
  async get(@Param('name') name: string): Promise<OrganizationEntity> {
    // TODO: implement access controls here
    this.logger.log(
      `Get organization request received for organization name: ${name}`
    );

    const organization = await this.organizationService.findOneByName(name);
    this.logger.log(
      `Found organization, name: ${name}, ID: ${organization.id}`
    );

    return organization;
  }

  /**
   * The API route for updating an organization.
   *
   * @param name The name of the organization to update.
   * @param updateOrganizationDto The new information for the organization.
   *
   * @returns The updated organization, if it was updated successfully.
   * @throws {NotFoundException} `organizationNameNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {BadRequestException} `organizationNameTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  @Patch(':name')
  async update(
    @Param('name') name: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<OrganizationEntity> {
    // TODO: implement access controls here
    this.logger.log(
      `Update organization request received for organization name: ${name}, with values: ${JSON.stringify(
        updateOrganizationDto
      )}`
    );

    const organization = await this.organizationService.findOneByName(name);
    const updatedOrganization = await this.organizationService.update(
      organization,
      updateOrganizationDto
    );
    this.logger.log(
      `Updated organization, name: ${updatedOrganization.name}, ID: ${updatedOrganization.id}`
    );

    return updatedOrganization;
  }

  /**
   * The API route for deleting an organization.
   *
   * @param name The name of the organization to delete.
   */
  @Delete(':name')
  async delete(@Param('name') name: string): Promise<void> {
    // TODO: implement access controls here
    this.logger.log(`Delete organization request received for name: ${name}`);
    const organization = await this.organizationService.findOneByName(name);
    await this.organizationService.delete(organization);
    this.logger.log(
      `Deleted organization, name: ${name}, ID: ${organization.id}`
    );
  }
}
