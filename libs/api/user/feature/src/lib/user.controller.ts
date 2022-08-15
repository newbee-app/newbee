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
import { UserService } from '@newbee/api/user/data-access';
import { UpdateUserDto, User } from '@newbee/shared/data-access';

@Controller({ path: 'user', version: '1' })
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<User> {
    this.logger.log(`Find user by id request received for id: ${id}`);
    const user = await this.userService.findOneById(id);
    if (!user) {
      const errorMsg = `User not found for id: ${id}`;
      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    this.logger.log(`Found user: ${JSON.stringify(user)}`);
    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    this.logger.log(
      `Update user request received for id: ${id}: ${JSON.stringify(
        updateUserDto
      )}`
    );
    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      const errorMsg = `User not found for id: ${id}`;
      this.logger.error(errorMsg);
      throw new NotFoundException(`User not found for id: ${id}`);
    }

    this.logger.log(`Updated user: ${JSON.stringify(user)}`);
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.logger.log(`Delete user request received for id: ${id}`);
    const deleted = await this.userService.delete(id);
    if (!deleted) {
      const errorMsg = `User not found for id: ${id}`;
      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    this.logger.log(`Deleted user for id: ${id}`);
  }
}
