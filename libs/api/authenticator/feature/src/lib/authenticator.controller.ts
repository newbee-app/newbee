import { Body, Controller, Logger, Post } from '@nestjs/common';
import {
  AuthenticatorService,
  RegistrationResponseDto,
} from '@newbee/api/authenticator/data-access';
import {
  AuthenticatorEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { User } from '@newbee/api/shared/util';
import {
  authenticator,
  authenticatorVersion,
  options,
} from '@newbee/shared/data-access';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * The controller that interacts with the `AuthenticatorEntity`.
 */
@Controller({ path: authenticator, version: authenticatorVersion })
export class AuthenticatorController {
  private readonly logger = new Logger(AuthenticatorController.name);

  constructor(private readonly authenticatorService: AuthenticatorService) {}

  /**
   * The API route for starting the WebAuthn authenticator registration process for a logged in user.
   *
   * @param user The user to associate with the authenticator.
   * @returns The registration options for the new authenticator.
   */
  @Post(options)
  async createOptions(
    @User() user: UserEntity
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    this.logger.log(
      `Create authenticator registration options request received for user ID: ${user.id}`
    );

    const options = await this.authenticatorService.generateOptions(user);
    this.logger.log(
      `Authenticator registration options created: ${JSON.stringify(options)}`
    );

    return options;
  }

  /**
   * The API route for completing the WebAuthn authenticator registration process for a logged in user.
   *
   * @param response The credential generated by the authenticator.
   * @param user The user to associate with the authenticator.
   *
   * @returns The newly created authenticator.
   * @throws {NotFoundException} `userChallengeIdNotFound`. If the user's challenge cannot be found.
   * @throws {BadRequestException} `authenticatorVerifyBadRequest`, `authenticatorTakenBadRequest`. If the authenticator cannot be verified or is already in use.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  @Post()
  async create(
    @Body() registrationResponseDto: RegistrationResponseDto,
    @User() user: UserEntity
  ): Promise<AuthenticatorEntity> {
    const { response } = registrationResponseDto;
    const responseString = JSON.stringify(response);
    this.logger.log(
      `Create authenticator verify request received for user ID: ${user.id}, response: ${responseString}`
    );

    const authenticator = await this.authenticatorService.create(
      response,
      user
    );
    this.logger.log(
      `Authenticator created for user ID: ${user.id}, ID: ${authenticator.id}, credential ID: ${authenticator.credentialId}`
    );

    return authenticator;
  }
}
