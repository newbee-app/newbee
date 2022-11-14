import { Body, Controller, Delete, Logger, Patch } from '@nestjs/common';
import { UserEntity } from '@newbee/api/shared/data-access';
import { User } from '@newbee/api/shared/util';
import { UpdateUserDto, UserService } from '@newbee/api/user/data-access';
import { userVersion } from '@newbee/shared/data-access';

@Controller({ path: 'user', version: userVersion })
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserEntity
  ): Promise<UserEntity> {
    const { id } = user;
    this.logger.log(
      `Update user request received for user ID: ${id}: ${JSON.stringify(
        updateUserDto
      )}`
    );
    const updatedUser = await this.userService.update(id, updateUserDto);
    this.logger.log(`Updated user: ${JSON.stringify(updatedUser)}`);
    return updatedUser;
  }

  @Delete()
  async delete(@User() user: UserEntity): Promise<void> {
    const { id } = user;
    this.logger.log(`Delete user request received for id: ${id}`);
    await this.userService.delete(id);
    this.logger.log(`Deleted user for id: ${id}`);
  }
}
