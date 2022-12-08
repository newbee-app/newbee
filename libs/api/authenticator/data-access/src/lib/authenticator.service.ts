import {
  EntityRepository,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticatorEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  AppConfigInterface,
  badRequestAuthenticatorErrorMsg,
  challengeFalsyLogMsg,
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialDescriptorFuture,
  RegistrationCredentialJSON,
} from '@simplewebauthn/typescript-types';

@Injectable()
export class AuthenticatorService {
  private readonly logger = new Logger(AuthenticatorService.name);

  constructor(
    @InjectRepository(AuthenticatorEntity)
    private readonly authenticatorRepository: EntityRepository<AuthenticatorEntity>,
    private readonly configService: ConfigService<AppConfigInterface, true>,
    private readonly userChallengeService: UserChallengeService
  ) {}

  async generateChallenge(
    user: UserEntity
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const authenticators: PublicKeyCredentialDescriptorFuture[] = (
      await this.findAllByEmail(user.email)
    ).map(({ credentialId, transports }) => ({
      id: Buffer.from(credentialId, 'base64url'),
      type: 'public-key',
      ...(transports && { transports }),
    }));

    const rpInfo = this.configService.get('rpInfo', { infer: true });
    const options = generateRegistrationOptions({
      rpName: rpInfo.name,
      rpID: rpInfo.id,
      userID: user.id,
      userName: user.email,
      userDisplayName: user.displayName ?? user.name,
      excludeCredentials: authenticators,
    });
    await this.userChallengeService.updateById(user.id, options.challenge);
    return options;
  }

  async create(
    credential: RegistrationCredentialJSON,
    user: UserEntity
  ): Promise<AuthenticatorEntity> {
    const userChallenge = await this.userChallengeService.findOneById(user.id);
    const { challenge } = userChallenge;
    if (!challenge) {
      this.logger.error(
        challengeFalsyLogMsg('registration', challenge, user.id)
      );
      throw new BadRequestException(badRequestAuthenticatorErrorMsg);
    }

    const rpInfo = this.configService.get('rpInfo', { infer: true });
    const verification = await verifyRegistrationResponse({
      credential,
      expectedChallenge: challenge,
      expectedOrigin: rpInfo.origin,
      expectedRPID: rpInfo.id,
    });
    const { verified, registrationInfo } = verification;
    if (!verified || !registrationInfo) {
      this.logger.error(`Could not verify credentials for user: ${user.id}`);
      throw new BadRequestException(badRequestAuthenticatorErrorMsg);
    }
    const {
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
    } = registrationInfo;

    try {
      const authenticator = this.authenticatorRepository.create({
        credentialId: credentialID.toString('base64url'),
        credentialPublicKey: credentialPublicKey.toString('base64url'),
        counter,
        credentialDeviceType,
        credentialBackedUp,
        ...(credential.transports && { transports: credential.transports }),
        user,
      });
      await this.authenticatorRepository.flush();
      return authenticator;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(
          'The authenticator you are trying to register has already been registered to an account.'
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async findAllByEmail(email: string): Promise<AuthenticatorEntity[]> {
    return await this.authenticatorRepository.find({ user: { email } });
  }

  async findOneById(id: string): Promise<AuthenticatorEntity> {
    try {
      return await this.authenticatorRepository.findOneOrFail(id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(
          idNotFoundErrorMsg('an', 'authenticator', 'an', 'ID', id)
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async findOneByCredentialId(
    credentialId: string
  ): Promise<AuthenticatorEntity> {
    try {
      return await this.authenticatorRepository.findOneOrFail({ credentialId });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(
          idNotFoundErrorMsg(
            'an',
            'authenticator',
            'a',
            'credential ID',
            credentialId
          )
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async updateById(id: string, counter: number): Promise<AuthenticatorEntity> {
    let authenticator = await this.findOneById(id);
    authenticator = this.authenticatorRepository.assign(authenticator, {
      counter,
    });
    await this.authenticatorRepository.flush();
    return authenticator;
  }

  async deleteOneById(id: string): Promise<void> {
    const authenticator = this.authenticatorRepository.getReference(id);
    await this.authenticatorRepository.removeAndFlush(authenticator);
  }
}
