import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Logger,
  Patch,
  Post,
} from '@nestjs/common';
import { UserEntity } from '@newbee/api/shared/data-access';
import {
  Public,
  UnverifiedOk,
  User,
  elongateUuid,
} from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { apiVersion } from '@newbee/shared/data-access';
import {
  Keyword,
  TokenDto,
  UpdateUserDto,
  internalServerError,
} from '@newbee/shared/util';

/**
 * The controller that interacts with the `UserEntity`.
 */
@Controller({ path: Keyword.User, version: apiVersion.user })
@UnverifiedOk()
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
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserEntity,
  ): Promise<UserEntity> {
    this.logger.log(
      `Update user request received for user ID: ${user.id}: ${JSON.stringify(
        updateUserDto,
      )}`,
    );
    user = await this.userService.update(user, updateUserDto);
    this.logger.log(`Updated user: ${user.id}`);
    return user;
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

  /**
   * The API route to request a verification email.
   *
   * @param user The user who's requesting a verification email.
   *
   * @returns The user who was just sent a verification email.
   * @throws {InternalServerErrorException} `internalServerError`. If there is an error sending the email.
   */
  @Post()
  async sendVerificationEmail(@User() user: UserEntity): Promise<UserEntity> {
    this.logger.log(
      `Send verification email received for user email: ${user.email}`,
    );
    const users = await this.userService.sendVerificationEmail(user);
    if (users.length === 1) {
      this.logger.log(`Sent verification email to: ${user.email}`);
      return users[0] as UserEntity;
    }

    throw new InternalServerErrorException(internalServerError);
  }

  /**
   * The API route for verifying a user's email.
   *
   * @param tokenDto The token to verify.
   *
   * @returns The `UserEntity` instance of the updated user.
   * @throws {NotFoundException} `userIdNotFound`. If the ORM throws a `NotFoundError`.
   */
  @Post(Keyword.Verify)
  @Public()
  async verifyEmail(@Body() tokenDto: TokenDto): Promise<UserEntity> {
    const { token } = tokenDto;
    this.logger.log(`Verify email request received for token: ${token}`);
    let user = await this.userService.findOneById(elongateUuid(token));
    user = await this.userService.verifyEmail(user);
    this.logger.log(`Email verified for user ID: ${user.id}`);
    return user;
  }
}
