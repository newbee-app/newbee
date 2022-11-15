import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AuthService,
  EmailDto,
  MagicLinkLoginStrategy,
  WebAuthnLoginDto,
} from '@newbee/api/auth/data-access';
import { MagicLinkLoginAuthGuard } from '@newbee/api/auth/util';
import { UserEntity } from '@newbee/api/shared/data-access';
import { Public, User } from '@newbee/api/shared/util';
import { CreateUserDto, UserService } from '@newbee/api/user/data-access';
import {
  authVersion,
  BaseLoginDto,
  BaseMagicLinkLoginDto,
  BaseUserCreatedDto,
} from '@newbee/shared/data-access';
import { magicLinkLogin, webauthn } from '@newbee/shared/util';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';

@Controller({ path: 'auth', version: authVersion })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly magicLinkLoginStrategy: MagicLinkLoginStrategy
  ) {}

  @Public()
  @Get(`${webauthn}/register`)
  async webauthnRegister(
    @Query() createUserDto: CreateUserDto
  ): Promise<BaseUserCreatedDto> {
    const createUserDtoString = JSON.stringify(createUserDto);
    this.logger.log(
      `WebAuthn register request received for: ${createUserDtoString}`
    );

    const userAndOptions = await this.userService.create(createUserDto);
    this.logger.log(`User created: ${JSON.stringify(userAndOptions)}`);

    const loginDto = this.authService.login(userAndOptions.user);
    this.logger.log(`Access token created: ${loginDto.access_token}`);

    return { ...loginDto, options: userAndOptions.options };
  }

  @Public()
  @Get(`${webauthn}/login`)
  async webauthnLoginGet(
    @Query() emailDto: EmailDto
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const { email } = emailDto;
    this.logger.log(
      `WebAuthn login challenge request received for email: ${email}`
    );

    const options = await this.authService.generateLoginChallenge(email);
    this.logger.log(
      `WebAuthn login challenge options generated: ${JSON.stringify(options)}`
    );
    return options;
  }

  @Post(`${webauthn}/login`)
  async webauthnLoginPost(
    @Body() webauthnLoginDto: WebAuthnLoginDto
  ): Promise<BaseLoginDto> {
    const { email, credential } = webauthnLoginDto;
    this.logger.log(
      `WebAuthn login verify request received for email: ${email}`
    );

    const user = await this.authService.verifyLoginChallenge(email, credential);
    const loginDto = this.authService.login(user);
    this.logger.log(
      `Credentials verified and access token created: ${loginDto.access_token}`
    );

    return loginDto;
  }

  @Public()
  @Get(`${magicLinkLogin}/login`)
  async magicLinkLoginLogin(
    @Query() emailDto: EmailDto
  ): Promise<BaseMagicLinkLoginDto> {
    const { email } = emailDto;
    this.logger.log(`Magic link login request received for: ${email}`);

    const jwtId = await this.magicLinkLoginStrategy.send({ email });
    this.logger.log(`Magic link sent to email: ${email}`);

    return { jwtId };
  }

  @Public()
  @UseGuards(MagicLinkLoginAuthGuard)
  @Get(magicLinkLogin)
  magicLinkLogin(@User() user: UserEntity): BaseLoginDto {
    const loginDto = this.authService.login(user);
    this.logger.log(
      `Access token generated: ${JSON.stringify(loginDto.access_token)}`
    );
    return loginDto;
  }
}
