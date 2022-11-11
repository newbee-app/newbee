import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import { AuthenticatorEntity } from '@newbee/api/shared/data-access';
import type { UserJwtPayload } from '@newbee/api/shared/util';
import { internalServerErrorMsg, User } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import { authenticatorVersion } from '@newbee/shared/data-access';
import { RegistrationCredentialJSON } from '@simplewebauthn/typescript-types';

@Controller({ path: 'authenticator', version: authenticatorVersion })
export class AuthenticatorController {
  private readonly logger = new Logger(AuthenticatorController.name);

  constructor(
    private readonly authenticatorService: AuthenticatorService,
    private readonly userService: UserService
  ) {}

  @Post('create')
  async create(
    @Body() credential: RegistrationCredentialJSON,
    @User() userJwtPayload: UserJwtPayload
  ): Promise<AuthenticatorEntity> {
    const credentialString = JSON.stringify(credential);
    const { sub: userId } = userJwtPayload;
    this.logger.log(
      `Create authenticator request received for user id: ${userId}, credential: ${credentialString}`
    );

    const user = await this.userService.findOneById(userId);
    if (!user) {
      this.logger.error(
        `Could not find user with id ${userId} even though JwtAuthGuard passed`
      );
      throw new InternalServerErrorException(internalServerErrorMsg);
    }

    return await this.authenticatorService.create(credential, user);
  }
}
