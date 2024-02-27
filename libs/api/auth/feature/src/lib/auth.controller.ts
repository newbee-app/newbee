import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthService,
  MagicLinkLoginStrategy,
  RegistrationGuard,
  WaitlistGuard,
} from '@newbee/api/auth/data-access';
import { AppAuthConfig, MagicLinkLoginAuthGuard } from '@newbee/api/auth/util';
import {
  EntityService,
  UserEntity,
  WaitlistMemberEntity,
} from '@newbee/api/shared/data-access';
import {
  Public,
  UnverifiedOk,
  User,
  authJwtCookie,
} from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { WaitlistMemberService } from '@newbee/api/waitlist-member/data-access';
import { apiVersion } from '@newbee/shared/data-access';
import {
  CreateUserDto,
  CreateWaitlistMemberDto,
  EmailDto,
  Keyword,
  MagicLinkLoginDto,
  UserRelation,
  UserRelationAndOptionsDto,
  WebAuthnLoginDto,
  internalServerError,
} from '@newbee/shared/util';
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types';
import type { CookieOptions, Response } from 'express';

/**
 * The controller that provides API routes for logging in and registering users.
 */
@Controller({ path: Keyword.Auth, version: apiVersion.auth })
@Public()
export class AuthController {
  /**
   * The logger to use to log anything in the controller.
   */
  private readonly logger = new Logger(AuthController.name);

  /**
   * The options to use when working with cookies.
   */
  private readonly cookieOptions: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    private readonly entityService: EntityService,
    private readonly userService: UserService,
    private readonly waitlistMemberService: WaitlistMemberService,
    private readonly magicLinkLoginStrategy: MagicLinkLoginStrategy,
    configService: ConfigService<AppAuthConfig, true>,
  ) {
    this.cookieOptions = configService.get('csrf.cookieOptions', {
      infer: true,
    });
  }

  /**
   * A publicly-accessible API route for registering a new user.
   *
   * @param createUserDto The details for the new user.
   *
   * @returns The new user, their access token, and the options needed to register an authenticator for use in WebAuthn authentication.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the email is already taken.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(`${Keyword.WebAuthn}/${Keyword.Register}`)
  @UseGuards(RegistrationGuard)
  async webAuthnRegister(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserRelationAndOptionsDto> {
    const createUserDtoString = JSON.stringify(createUserDto);
    this.logger.log(
      `WebAuthn register request received for: ${createUserDtoString}`,
    );

    const userAndOptions = await this.userService.create(createUserDto);
    const { user, options } = userAndOptions;
    this.logger.log(`User created with ID: ${user.id}, email: ${user.email}`);

    const accessToken = this.authService.login(user);
    this.logger.log(`Access token created: ${accessToken}`);

    res.cookie(authJwtCookie, accessToken, this.cookieOptions);
    return new UserRelationAndOptionsDto(
      await this.entityService.createUserRelation(user),
      options,
    );
  }

  /**
   * A publicly-accessible API route for starting the WebAuthn log in process.
   *
   * @param emailDto The user's email as a verified DTO.
   *
   * @returns The challenge for the user's authenticator to verify.
   * @throws {NotFoundException} `userEmailNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Post(`${Keyword.WebAuthn}/${Keyword.Login}/${Keyword.Options}`)
  async webAuthnLoginOptions(
    @Body() emailDto: EmailDto,
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const { email } = emailDto;
    this.logger.log(
      `WebAuthn login option request received for email: ${email}`,
    );

    const options = await this.authService.generateLoginChallenge(email);
    this.logger.log(
      `WebAuthn login options generated: ${JSON.stringify(options)}`,
    );
    return options;
  }

  /**
   * A publicly-accessible API route for completing the WebAuthn log in process.
   *
   * @param webAuthnLoginDto The user's authenticator's attempt at verifying the backend's challenge.
   *
   * @returns The logged in user and their access token, if verified.
   * @throws {NotFoundException} `userEmailNotFound`, `authenticatorCredentialIdNotFound`, `authenticatorIdNotFound`.
   * If the user challenge cannot be found by email or the authenticator cannot be found by credential ID nor ID.
   * @throws {ForbiddenException} `forbiddenError`. If the user's authenticator is somehow not assigned to the user (should never happen).
   * @throws {BadRequestException} `authenticatorVerifyBadRequest`. If the challenge can't be verified.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post(`${Keyword.WebAuthn}/${Keyword.Login}`)
  async webAuthnLogin(
    @Res({ passthrough: true }) res: Response,
    @Body() webAuthnLoginDto: WebAuthnLoginDto,
  ): Promise<UserRelation> {
    const { email, response } = webAuthnLoginDto;
    this.logger.log(
      `WebAuthn login verify request received for email: ${email}`,
    );

    const user = await this.authService.verifyLoginChallenge(email, response);
    const accessToken = this.authService.login(user);
    this.logger.log(
      `Credentials verified and access token created: ${accessToken}`,
    );

    res.cookie(authJwtCookie, accessToken, this.cookieOptions);
    return await this.entityService.createUserRelation(user);
  }

  /**
   * A publicly-accessible API route for sending a magic link login request.
   *
   * @param emailDto The email to send the magic link to.
   *
   * @returns The JWT ID and email associated with the magic link email.
   * @throws {InternalServerErrorException} `internalServerError`. If something goes wrong sending the email.
   */
  @Post(`${Keyword.MagicLinkLogin}/${Keyword.Login}`)
  async magicLinkLoginLogin(
    @Body() emailDto: EmailDto,
  ): Promise<MagicLinkLoginDto> {
    const { email } = emailDto;
    this.logger.log(`Magic link login request received for: ${email}`);

    try {
      const jwtId = await this.magicLinkLoginStrategy.send({ email });
      this.logger.log(`Magic link sent to email: ${email}`);

      return new MagicLinkLoginDto(jwtId, email);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Called after the user has already been verified using Nest's provided Passport guard.
   * A publicly-accessible API route for validating a magic link's token and logging in the user, if valid.
   *
   * @param user The logged in user.
   *
   * @returns The logged in user and their access token.
   */
  @UseGuards(MagicLinkLoginAuthGuard)
  @Post(Keyword.MagicLinkLogin)
  async magicLinkLogin(
    @Res({ passthrough: true }) res: Response,
    @User() user: UserEntity,
  ): Promise<UserRelation> {
    const accessToken = this.authService.login(user);
    this.logger.log(`Access token generated: ${accessToken}`);

    res.cookie(authJwtCookie, accessToken, this.cookieOptions);
    return await this.entityService.createUserRelation(user);
  }

  /**
   * Called by the user to log out.
   *
   * @param res The response object to clear the auth token cookie from.
   */
  @Post(Keyword.Logout)
  @Public(false)
  @UnverifiedOk()
  logout(
    @Res({ passthrough: true }) res: Response,
    @User() user: UserEntity,
  ): void {
    this.logger.log(`Logout request received from user ID: ${user.id}`);
    res.clearCookie(authJwtCookie, this.cookieOptions);
    this.logger.log(`Logged out user ID: ${user.id}`);
  }

  /**
   * Signs up an email and name to the waitlist.
   *
   * @param createWaitlistMemberDto The email and name to add to the waitlist.
   *
   * @returns The waitlist member that was added to the waitlist.
   * @throws {BadRequestException} `emailAlreadyRegisteredBadRequest`, `alreadyOnWaitlistBadRequest`. If the given email is already a user or a waitlist member.
   * @throws {InternalServerErrorException} `internalServerError`. For any other error.
   */
  @Post(Keyword.Waitlist)
  @UseGuards(WaitlistGuard)
  async signUpForWaitlist(
    @Body() createWaitlistMemberDto: CreateWaitlistMemberDto,
  ): Promise<WaitlistMemberEntity> {
    const { email } = createWaitlistMemberDto;
    this.logger.log(`Waitlist sign-up request received for email: ${email}`);
    const waitlistMember = await this.waitlistMemberService.create(
      createWaitlistMemberDto,
    );
    this.logger.log(`Signed up email to waitlist: ${email}`);
    return waitlistMember;
  }
}
