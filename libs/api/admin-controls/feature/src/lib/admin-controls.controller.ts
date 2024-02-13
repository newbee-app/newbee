import { Body, Controller, Get, Logger, Patch } from '@nestjs/common';
import { AdminControlsService } from '@newbee/api/admin-controls/data-access';
import { EntityService, UserEntity } from '@newbee/api/shared/data-access';
import { Role, User } from '@newbee/api/shared/util';
import { apiVersion } from '@newbee/shared/data-access';
import {
  AdminControls,
  AdminControlsRelation,
  Keyword,
  UpdateAdminControlsDto,
  apiRoles,
} from '@newbee/shared/util';

/**
 * The controller that interacts with `AdminControlsEntity`.
 */
@Controller({
  path: Keyword.Admin,
  version: apiVersion.admin,
})
export class AdminControlsController {
  /**
   * The logger to use when logging anything in the controller.
   */
  private readonly logger = new Logger(AdminControlsController.name);

  constructor(
    private readonly adminControlsService: AdminControlsService,
    private readonly entityService: EntityService,
  ) {}

  /**
   * The API route for getting admin controls.
   *
   * @param user The user making the request.
   *
   * @returns The NewBee instance's admin controls.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  @Get()
  @Role(apiRoles.admin.get)
  async get(@User() user: UserEntity): Promise<AdminControlsRelation> {
    this.logger.log(
      `Get admin controls request received from user ID: ${user.id}`,
    );
    const adminControls = await this.adminControlsService.get();
    this.logger.log(`Got admin controls for user ID: ${user.id}`);
    return await this.entityService.createAdminControlsRelation(adminControls);
  }

  /**
   * The API route for updating admin controls.
   *
   * @param updateAdminControlsDto The new details for the admin controls.
   * @param user The user making the request.
   *
   * @returns The updated admin controls.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  @Patch()
  @Role(apiRoles.admin.update)
  async update(
    @Body() updateAdminControlsDto: UpdateAdminControlsDto,
    @User() user: UserEntity,
  ): Promise<AdminControls> {
    this.logger.log(
      `Update admin controls request received from user ID: ${user.id}`,
    );
    const adminControls = await this.adminControlsService.update(
      updateAdminControlsDto,
    );
    this.logger.log(`Updated admin controls for user ID: ${user.id}`);
    return adminControls;
  }
}
