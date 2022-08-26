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
import {
  AuthService,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { MagicLinkLoginAuthGuard } from '@newbee/api/auth/util';
import { UserEntity } from '@newbee/api/shared/data-access';
import { Public, User } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import {
  authVersion,
  CreateUserDto,
  LoginDto,
  MagicLinkLoginLoginDto,
} from '@newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';

@Controller({ path: 'auth', version: authVersion })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly magicLinkLoginStrategy: MagicLinkLoginStrategy
  ) {}

  @Public()
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

    this.logger.log(`Valid email found for email: ${email}`);
    await this.trySendMagicLink(email);
  }

  @Public()
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
      await this.magicLinkLoginStrategy.send({ email });
      throw new ConflictException(errorMsg);
    }

    user = await this.userService.create(createUserDto);
    if (!user) {
      const errorMsg = `User could not be created for: ${createUserDtoString}`;
      this.logger.error(errorMsg);
      throw new InternalServerErrorException(errorMsg);
    }

    this.logger.log(`Created user: ${JSON.stringify(user)}`);
    await this.trySendMagicLink(email);
  }

  @Public()
  @UseGuards(MagicLinkLoginAuthGuard)
  @Get(magicLinkLogin)
  magicLinkLogin(@User() user: UserEntity): LoginDto {
    this.logger.log(
      `Generating access token for user: ${JSON.stringify(user)}`
    );
    const loginDto = this.authService.login(user);
    this.logger.log(
      `Access token generated: ${JSON.stringify(loginDto.access_token)}`
    );
    return loginDto;
  }

  private async trySendMagicLink(email: string): Promise<void> {
    this.logger.log(`Sending magic link to email: ${email}`);
    try {
      this.magicLinkLoginStrategy.send({ email });
    } catch (err: unknown) {
      const errorMsg = `Magic link could not be sent to email: ${email}, error: ${err}`;
      this.logger.error(errorMsg);
      throw new InternalServerErrorException(errorMsg);
    }
  }
}
