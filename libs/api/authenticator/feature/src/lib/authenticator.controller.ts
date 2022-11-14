import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import {
  AuthenticatorEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { User } from '@newbee/api/shared/util';
import { authenticatorVersion } from '@newbee/shared/data-access';
import { RegistrationCredentialJSON } from '@simplewebauthn/typescript-types';

@Controller({ path: 'authenticator', version: authenticatorVersion })
export class AuthenticatorController {
  private readonly logger = new Logger(AuthenticatorController.name);

  constructor(private readonly authenticatorService: AuthenticatorService) {}

  @Post('create')
  async create(
    @Body() credential: RegistrationCredentialJSON,
    @User() user: UserEntity
  ): Promise<AuthenticatorEntity> {
    const credentialString = JSON.stringify(credential);
    this.logger.log(
      `Create authenticator request received for user id: ${user.id}, credential: ${credentialString}`
    );

    return await this.authenticatorService.create(credential, user);
  }
}
