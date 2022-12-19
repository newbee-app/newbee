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
  auth,
  authVersion,
  BaseLoginDto,
  BaseMagicLinkLoginDto,
  BaseUserCreatedDto,
  login,
  register,
  webauthn,
} from '@newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * The controller that provides API routes for logging in and registering users.
 */
@Controller({ path: auth, version: authVersion })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly magicLinkLoginStrategy: MagicLinkLoginStrategy
  ) {}

  /**
   * A publicly-accessible API route for registering a new user.
   *
   * @param createUserDto The details for the new user.
   *
   * @returns The new user, their access token, and the options needed to register an authenticator for use in WebAuthn authentication.
   */
  @Public()
  @Post(`${webauthn}/${register}`)
  async webAuthnRegister(
    @Body() createUserDto: CreateUserDto
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

  /**
   * A publicly-accessible API route for starting the WebAuthn log in process.
   *
   * @param emailDto The user's email as a verified DTO.
   *
   * @returns The challenge for the user's authenticator to verify.
   */
  @Public()
  @Get(`${webauthn}/${login}`)
  async webAuthnLoginGet(
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

  /**
   * A publicly-accessible API route for completing the WebAuthn log in process.
   *
   * @param webAuthnLoginDto The user's authenticator's attempt at verifying the backend's challenge.
   *
   * @returns The logged in user and their access token, if verified.
   */
  @Public()
  @Post(`${webauthn}/${login}`)
  async webAuthnLoginPost(
    @Body() webAuthnLoginDto: WebAuthnLoginDto
  ): Promise<BaseLoginDto> {
    const { email, credential } = webAuthnLoginDto;
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

  /**
   * A publicly-accessible API route for sending a magic link login request.
   *
   * @param emailDto The email to send the magic link to.
   *
   * @returns The JWT ID and email associated with the magic link email.
   */
  @Public()
  @Get(`${magicLinkLogin}/${login}`)
  async magicLinkLoginLogin(
    @Query() emailDto: EmailDto
  ): Promise<BaseMagicLinkLoginDto> {
    const { email } = emailDto;
    this.logger.log(`Magic link login request received for: ${email}`);

    const jwtId = await this.magicLinkLoginStrategy.send({ email });
    this.logger.log(`Magic link sent to email: ${email}`);

    return { jwtId, email };
  }

  /**
   * Called after the user has already been verified using Nest's provided Passport guard.
   * A publicly-accessible API route for validating a magic link's token and logging in the user, if valid.
   *
   * @param user The logged in user.
   *
   * @returns The logged in user and their access token.
   */
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
