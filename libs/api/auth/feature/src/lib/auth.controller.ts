import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MagicLinkLoginStrategy } from '@newbee/api/auth/data-access';
import {
  magicLinkLogin,
  MagicLinkLoginAuthGuard,
  MagicLinkLoginLoginDto,
} from '@newbee/api/auth/util';
import { User as UserEntity } from '@newbee/api/shared/data-access';
import { User } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { CreateUserDto } from '@newbee/api/user/util';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly magicLinkLoginStrategy: MagicLinkLoginStrategy
  ) {}

  @Post(`${magicLinkLogin}/login`)
  async checkAndLogin(
    @Body() magicLinkLoginLoginDto: MagicLinkLoginLoginDto
  ): Promise<void> {
    this.logger.log(
      `Check and login request received: ${JSON.stringify(
        magicLinkLoginLoginDto
      )}`
    );
    const email = magicLinkLoginLoginDto.email;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      const errorMsg = `User not found for email: ${email}`;
      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    this.logger.log(
      `Valid email found for email: ${email}, sending magic link`
    );
    this.magicLinkLoginStrategy.send({ email });
  }

  @Post(`${magicLinkLogin}/register`)
  async checkAndRegister(@Body() createUserDto: CreateUserDto): Promise<void> {
    const createUserDtoString = JSON.stringify(createUserDto);
    this.logger.log(
      `Check and register request received: ${createUserDtoString}`
    );
    const email = createUserDto.email;

    let user = await this.userService.findOneByEmail(email);
    if (user) {
      const errorMsg = `User found for email: ${email}, sending user login magic link instead of registering`;
      this.logger.error(errorMsg);
      this.magicLinkLoginStrategy.send({ email });
      throw new ConflictException(errorMsg);
    }

    user = await this.userService.create(createUserDto);
    if (!user) {
      const errorMsg = `User could not be created for: ${createUserDtoString}`;
      this.logger.error(errorMsg);
      throw new InternalServerErrorException(errorMsg);
    }

    this.logger.log(`Created user: ${JSON.stringify(user)}`);
    this.magicLinkLoginStrategy.send({ email });
  }

  @UseGuards(MagicLinkLoginAuthGuard)
  @Get(magicLinkLogin)
  async magicLoginCallback(@User() user: UserEntity): Promise<UserEntity> {
    return user;
  }
}
