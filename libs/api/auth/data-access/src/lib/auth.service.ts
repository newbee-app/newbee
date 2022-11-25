import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatorService } from '@newbee/api/authenticator/data-access';
import { UserEntity } from '@newbee/api/shared/data-access';
import {
  AppConfigInterface,
  badRequestAuthenticatorErrorMsg,
  challengeFalsyLogMsg,
  idNotFoundLogMsg,
  internalServerErrorMsg,
  UserJwtPayload,
} from '@newbee/api/shared/util';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';
import { BaseLoginDto } from '@newbee/shared/data-access';
import type { VerifiedAuthenticationResponse } from '@simplewebauthn/server';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  AuthenticationCredentialJSON,
  AuthenticatorDevice,
  PublicKeyCredentialDescriptorFuture,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/typescript-types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authenticatorService: AuthenticatorService,
    private readonly userChallengeService: UserChallengeService,
    private readonly configService: ConfigService<AppConfigInterface, true>
  ) {}

  login(user: UserEntity): BaseLoginDto {
    const payload: UserJwtPayload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload), user };
  }

  async generateLoginChallenge(
    email: string
  ): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const allowCredentials: PublicKeyCredentialDescriptorFuture[] = (
      await this.authenticatorService.findAllByEmail(email)
    ).map(({ credentialId, transports }) => ({
      id: Buffer.from(credentialId, 'base64url'),
      type: 'public-key',
      ...(transports && { transports }),
    }));

    const options = generateAuthenticationOptions({
      allowCredentials,
      userVerification: 'preferred',
      rpID: this.configService.get('rpInfo.id', { infer: true }),
    });

    await this.userChallengeService.updateByEmail(email, options.challenge);

    return options;
  }

  async verifyLoginChallenge(
    email: string,
    credential: AuthenticationCredentialJSON
  ): Promise<UserEntity> {
    const userChallenge = await this.userChallengeService.findOneByEmail(email);
    if (!userChallenge) {
      this.logger.error(
        `User challenge not defined although user is for email: ${email}`
      );
      throw new InternalServerErrorException(internalServerErrorMsg);
    }

    const { user, challenge } = userChallenge;
    if (!challenge) {
      this.logger.error(challengeFalsyLogMsg('login', challenge, user.id));
      throw new BadRequestException(badRequestAuthenticatorErrorMsg);
    }

    const { id } = credential;
    const authenticator = await this.authenticatorService.findOneByCredentialId(
      id
    );
    if (!authenticator) {
      this.logger.error(
        idNotFoundLogMsg('find', 'an', 'authenticator', 'credential ID', id)
      );
      throw new BadRequestException(badRequestAuthenticatorErrorMsg);
    }

    const { credentialPublicKey, credentialId, counter, transports } =
      authenticator;
    const authenticatorDevice: AuthenticatorDevice = {
      credentialPublicKey: Buffer.from(credentialPublicKey, 'base64url'),
      credentialID: Buffer.from(credentialId, 'base64url'),
      counter,
      ...(transports && { transports }),
    };

    const rpInfo = this.configService.get('rpInfo', { infer: true });
    let verification: VerifiedAuthenticationResponse;
    try {
      verification = await verifyAuthenticationResponse({
        credential,
        expectedChallenge: challenge,
        expectedOrigin: rpInfo.origin,
        expectedRPID: rpInfo.id,
        authenticator: authenticatorDevice,
      });
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(badRequestAuthenticatorErrorMsg);
    }

    const { verified, authenticationInfo } = verification;
    if (!verified) {
      this.logger.error(`Could not verify credentials for user: ${user.id}`);
      throw new BadRequestException(badRequestAuthenticatorErrorMsg);
    }

    await this.authenticatorService.updateById(
      authenticator.id,
      authenticationInfo.newCounter
    );
    return user;
  }
}
