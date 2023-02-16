import { Body, Controller, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthService,
  EmailDto,
  MagicLinkLoginStrategy,
  WebAuthnLoginDto,
} from '@newbee/api/auth/data-access';
import { AppAuthConfig, MagicLinkLoginAuthGuard } from '@newbee/api/auth/util';
import { UserAndOptionsDto, UserEntity } from '@newbee/api/shared/data-access';
import { authJwtCookie, Public, User } from '@newbee/api/shared/util';
import { CreateUserDto, UserService } from '@newbee/api/user/data-access';
import {
  auth,
  authVersion,
  BaseMagicLinkLoginDto,
  login,
  options,
  register,
  webauthn,
} from '@newbee/shared/data-access';
import { magicLinkLogin } from '@newbee/shared/util';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';
import type { Response } from 'express';

/**
 * The controller that provides API routes for logging in and registering users.
 */
@Controller({ path: auth, version: authVersion })
export class AuthController {
  /**
   * The logger to use to log anything in the controller.
   */
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly magicLinkLoginStrategy: MagicLinkLoginStrategy,
    private readonly configService: ConfigService<AppAuthConfig, true>
  ) {}

  /**
   * A publicly-accessible API route for registering a new user.
   *
   * @param createUserDto The details for the new user.
   *
   * @returns The new user, their access token, and the options needed to register an authenticator for use in WebAuthn authentication.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the email is already taken.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Public()
  @Post(`${webauthn}/${register}`)
  async webAuthnRegister(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto
  ): Promise<UserAndOptionsDto> {
    const createUserDtoString = JSON.stringify(createUserDto);
    this.logger.log(
      `WebAuthn register request received for: ${createUserDtoString}`
    );

    const userAndOptions = await this.userService.create(createUserDto);
    const { user } = userAndOptions;
    this.logger.log(`User created with ID: ${user.id}, email: ${user.email}`);

    const accessToken = this.authService.login(userAndOptions.user);
    this.logger.log(`Access token created: ${accessToken}`);

    res.cookie(
      authJwtCookie,
      accessToken,
      this.configService.get('csrf.cookieOptions', { infer: true })
    );
    return userAndOptions;
  }

  /**
   * A publicly-accessible API route for starting the WebAuthn log in process.
   *
   * @param emailDto The user's email as a verified DTO.
   *
   * @returns The challenge for the user's authenticator to verify.
   */
  @Public()
  @Post(`${webauthn}/${login}/${options}`)
  async webAuthnLoginOptions(
    @Body() emailDto: EmailDto
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const { email } = emailDto;
    this.logger.log(
      `WebAuthn login option request received for email: ${email}`
    );

    const options = await this.authService.generateLoginChallenge(email);
    this.logger.log(
      `WebAuthn login options generated: ${JSON.stringify(options)}`
    );
    return options;
  }

  /**
   * A publicly-accessible API route for completing the WebAuthn log in process.
   *
   * @param webAuthnLoginDto The user's authenticator's attempt at verifying the backend's challenge.
   *
   * @returns The logged in user and their access token, if verified.
   * @throws {NotFoundException} `userChallengeEmailNotFound`, `authenticatorCredentialIdNotFound`.
   * If the user challenge cannot be found by email or the authenticator cannot be found by credential ID.
   * @throws {BadRequestException} `authenticatorVerifyBadRequest`. If the challenge can't be verified.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Public()
  @Post(`${webauthn}/${login}`)
  async webAuthnLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() webAuthnLoginDto: WebAuthnLoginDto
  ): Promise<UserEntity> {
    const { email, response } = webAuthnLoginDto;
    this.logger.log(
      `WebAuthn login verify request received for email: ${email}`
    );

    const user = await this.authService.verifyLoginChallenge(email, response);
    const accessToken = this.authService.login(user);
    this.logger.log(
      `Credentials verified and access token created: ${accessToken}`
    );

    res.cookie(
      authJwtCookie,
      accessToken,
      this.configService.get('csrf.cookieOptions', { infer: true })
    );
    return user;
  }

  /**
   * A publicly-accessible API route for sending a magic link login request.
   *
   * @param emailDto The email to send the magic link to.
   *
   * @returns The JWT ID and email associated with the magic link email.
   * @throws {InternalServerErrorException} `internalServerError`. If something goes wrong sending the email.
   */
  @Public()
  @Post(`${magicLinkLogin}/${login}`)
  async magicLinkLoginLogin(
    @Body() emailDto: EmailDto
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
  @Post(magicLinkLogin)
  magicLinkLogin(
    @Res({ passthrough: true }) res: Response,
    @User() user: UserEntity
  ): UserEntity {
    const accessToken = this.authService.login(user);
    this.logger.log(`Access token generated: ${accessToken}`);

    res.cookie(
      authJwtCookie,
      accessToken,
      this.configService.get('csrf.cookieOptions', { infer: true })
    );
    return user;
  }
}
