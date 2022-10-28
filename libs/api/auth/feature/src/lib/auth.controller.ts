import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AuthService,
  MagicLinkLoginLoginDto,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { MagicLinkLoginAuthGuard } from '@newbee/api/auth/util';
import { UserEntity } from '@newbee/api/shared/data-access';
import { Public, User } from '@newbee/api/shared/util';
import { CreateUserDto, UserService } from '@newbee/api/user/data-access';
import {
  authVersion,
  BaseLoginDto,
  BaseMagicLinkLoginDto,
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
  @Get(`${magicLinkLogin}/login`)
  async login(
    @Query() magicLinkLoginLoginDto: MagicLinkLoginLoginDto
  ): Promise<BaseMagicLinkLoginDto> {
    const { email } = magicLinkLoginLoginDto;
    this.logger.log(`Check email request received for: ${email}`);
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      this.logger.log(`User not found for email: ${email}`);
      return { jwtId: null };
    }

    this.logger.log(`User found for email: ${email}`);
    const jwtId = await this.trySendMagicLink(email);
    return { jwtId };
  }

  @Public()
  @Post(`${magicLinkLogin}/register`)
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<BaseMagicLinkLoginDto> {
    const createUserDtoString = JSON.stringify(createUserDto);
    this.logger.log(`Register request received: ${createUserDtoString}`);
    const { email } = createUserDto;
    const magicLinkLoginDto = await this.login({ email });
    if (magicLinkLoginDto.jwtId) {
      return magicLinkLoginDto;
    }

    const user = await this.userService.create(createUserDto);
    if (!user) {
      const errorMsg = `User could not be created for: ${createUserDtoString}`;
      this.logger.error(errorMsg);
      throw new InternalServerErrorException(errorMsg);
    }

    this.logger.log(`Created user: ${JSON.stringify(user)}`);
    const jwtId = await this.trySendMagicLink(email);
    return { jwtId };
  }

  @Public()
  @UseGuards(MagicLinkLoginAuthGuard)
  @Get(magicLinkLogin)
  magicLinkLogin(@User() user: UserEntity): BaseLoginDto {
    this.logger.log(
      `Generating access token for user: ${JSON.stringify(user)}`
    );
    const loginDto = this.authService.login(user);
    this.logger.log(
      `Access token generated: ${JSON.stringify(loginDto.access_token)}`
    );
    return loginDto;
  }

  private async trySendMagicLink(email: string): Promise<string> {
    this.logger.log(`Sending magic link to email: ${email}`);
    try {
      return await this.magicLinkLoginStrategy.send({ email });
    } catch (err: unknown) {
      const errorMsg = `Magic link could not be sent to email: ${email}, error: ${err}`;
      this.logger.error(errorMsg);
      throw new InternalServerErrorException(errorMsg);
    }
  }
}
