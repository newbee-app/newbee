import { Body, Controller, Delete, Logger, Patch } from '@nestjs/common';
import { UserEntity } from '@newbee/api/shared/data-access';
import { User } from '@newbee/api/shared/util';
import { UpdateUserDto, UserService } from '@newbee/api/user/data-access';
import { user, userVersion } from '@newbee/shared/data-access';

/**
 * The controller that interacts with the `UserEntity`.
 */
@Controller({ path: user, version: userVersion })
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /**
   * The API route for updating the authenticated user.
   *
   * @param updateUserDto The new user details.
   * @param user The `UserEntity` instance to update.
   *
   * @returns The updated `UserEntity` instance.
   */
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserEntity
  ): Promise<UserEntity> {
    this.logger.log(
      `Update user request received for user ID: ${user.id}: ${JSON.stringify(
        updateUserDto
      )}`
    );
    const updatedUser = await this.userService.update(user, updateUserDto);
    this.logger.log(`Updated user: ${JSON.stringify(updatedUser)}`);
    return updatedUser;
  }

  /**
   * The API route for deleting the authenticated user.
   *
   * @param user The `UserEntity` instance to delete.
   */
  @Delete()
  async delete(@User() user: UserEntity): Promise<void> {
    this.logger.log(`Delete user request received for ID: ${user.id}`);
    await this.userService.delete(user);
    this.logger.log(`Deleted user for ID: ${user.id}`);
  }
}
