import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthService,
  EmailDto,
  MagicLinkLoginStrategy,
} from '@newbee/api/auth/data-access';
import { MagicLinkLoginAuthGuard } from '@newbee/api/auth/util';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import { UserEntity } from '@newbee/api/shared/data-access';
import { AppConfigInterface, Public, User } from '@newbee/api/shared/util';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';
import { CreateUserDto, UserService } from '@newbee/api/user/data-access';
import {
  authVersion,
  BaseLoginDto,
  BaseMagicLinkLoginDto,
  BaseUserCreatedDto,
} from '@newbee/shared/data-access';
import { magicLinkLogin, webauthn } from '@newbee/shared/util';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import type {
  PublicKeyCredentialDescriptorFuture,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/typescript-types';

@Controller({ path: 'auth', version: authVersion })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly authenticatorService: AuthenticatorService,
    private readonly userChallengeService: UserChallengeService,
    private readonly configService: ConfigService<AppConfigInterface, true>,
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
  async webauthnLogin(
    @Query() emailDto: EmailDto
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const { email } = emailDto;
    this.logger.log(`WebAuthn login request received for email: ${email}`);

    this.logger.log(`Getting authenticators for user email: ${email}`);
    const allowCredentials: PublicKeyCredentialDescriptorFuture[] = (
      await this.authenticatorService.findAllByEmail(email)
    ).map(({ credentialId, transports }) => ({
      id: Buffer.from(credentialId, 'base64url'),
      type: 'public-key',
      ...(transports && { transports }),
    }));

    this.logger.log(
      `Generating authentication options for user email: ${email}`
    );
    const options = generateAuthenticationOptions({
      allowCredentials,
      userVerification: 'preferred',
      rpID: this.configService.get('rpInfo.id', { infer: true }),
    });

    const { challenge } = options;
    this.logger.log(
      `Setting user challenge for user email: ${email}, challenge: ${challenge}`
    );
    await this.userChallengeService.updateByEmail(email, challenge);
    return options;
  }

  @Public()
  @Get(`${magicLinkLogin}/login`)
  async magicLinkLoginLogin(
    @Query() emailDto: EmailDto
  ): Promise<BaseMagicLinkLoginDto> {
    const { email } = emailDto;
    this.logger.log(`Magic link login request received for: ${email}`);

    this.logger.log(`Sending magic link to email: ${email}`);
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
