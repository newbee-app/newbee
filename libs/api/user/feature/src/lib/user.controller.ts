import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UserEntity } from '@newbee/api/shared/data-access';
import { idNotFoundErrorMsg } from '@newbee/api/shared/util';
import { UpdateUserDto, UserService } from '@newbee/api/user/data-access';
import { userVersion } from '@newbee/shared/data-access';

@Controller({ path: 'user', version: userVersion })
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<UserEntity> {
    this.logger.log(`Find user by id request received for ID: ${id}`);
    const user = await this.userService.findOneById(id);
    if (!user) {
      this.logger.error(`Attempted to find user with invalid ID: ${id}`);
      throw new NotFoundException(idNotFoundErrorMsg('a', 'user', id));
    }

    this.logger.log(`Found user: ${JSON.stringify(user)}`);
    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    this.logger.log(
      `Update user request received for id: ${id}: ${JSON.stringify(
        updateUserDto
      )}`
    );
    const user = await this.userService.update(id, updateUserDto);
    this.logger.log(`Updated user: ${JSON.stringify(user)}`);
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.logger.log(`Delete user request received for id: ${id}`);
    await this.userService.delete(id);
    this.logger.log(`Deleted user for id: ${id}`);
  }
}
