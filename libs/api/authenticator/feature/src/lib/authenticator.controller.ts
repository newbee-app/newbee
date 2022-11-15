import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import {
  AuthenticatorEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { User } from '@newbee/api/shared/util';
import { authenticatorVersion } from '@newbee/shared/data-access';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationCredentialJSON,
} from '@simplewebauthn/typescript-types';

@Controller({ path: 'authenticator', version: authenticatorVersion })
export class AuthenticatorController {
  private readonly logger = new Logger(AuthenticatorController.name);

  constructor(private readonly authenticatorService: AuthenticatorService) {}

  @Get('create')
  async createGet(
    @User() user: UserEntity
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    this.logger.log(
      `Create authenticator challenge request received for user ID: ${user.id}`
    );

    const options = await this.authenticatorService.generateChallenge(user);
    this.logger.log(`Challenge created: ${JSON.stringify(options)}`);

    return options;
  }

  @Post('create')
  async createPost(
    @Body() credential: RegistrationCredentialJSON,
    @User() user: UserEntity
  ): Promise<AuthenticatorEntity> {
    const credentialString = JSON.stringify(credential);
    this.logger.log(
      `Create authenticator verify request received for user ID: ${user.id}, credential: ${credentialString}`
    );

    const authenticator = await this.authenticatorService.create(
      credential,
      user
    );
    this.logger.log(`Authenticator created: ${JSON.stringify(authenticator)}`);

    return authenticator;
  }
}
