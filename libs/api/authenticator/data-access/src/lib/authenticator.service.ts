import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthenticatorEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import {
  AppConfigInterface,
  createConflictLogMsg,
  idNotFoundErrorMsg,
  idNotFoundLogMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import type { RegistrationCredentialJSON } from '@simplewebauthn/typescript-types';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticatorService {
  private readonly logger = new Logger(AuthenticatorService.name);

  constructor(
    @InjectRepository(AuthenticatorEntity)
    private readonly authenticatorRepository: Repository<AuthenticatorEntity>,
    private readonly configService: ConfigService<AppConfigInterface, true>,
    private readonly userChallengeService: UserChallengeService
  ) {}

  async create(
    credential: RegistrationCredentialJSON,
    user: UserEntity
  ): Promise<AuthenticatorEntity> {
    const userString = JSON.stringify(user);
    if (await this.findOneByCredentialId(credential.id)) {
      this.logger.error(
        createConflictLogMsg(
          'an',
          'authenticator',
          'credential ID',
          credential.id
        )
      );
      throw new BadRequestException(
        'The authenticator you are trying to register has already been registered to your account, try logging in instead!'
      );
    }

    const userChallenge = await this.userChallengeService.findOneById(user.id);
    if (!userChallenge) {
      this.logger.error(
        `User challenge not defined although user is: ${userString}`
      );
      throw new InternalServerErrorException(internalServerErrorMsg);
    }

    const { challenge } = userChallenge;
    if (!challenge) {
      this.logger.error(
        `Attempted to verify a registration response even though user's challenge string is ${challenge} for user: ${userString}`
      );
      throw new BadRequestException(
        'We could not verify this authenticator, please try the process over from the beginning!'
      );
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
      throw new BadRequestException(
        'We could not verify this authenticator, please try the process over from the beginning!'
      );
    }
    const {
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
    } = registrationInfo;

    try {
      return await this.authenticatorRepository.save(
        new AuthenticatorEntity({
          credentialId: credentialID.toString('base64url'),
          credentialPublicKey,
          counter,
          credentialDeviceType,
          credentialBackedUp,
          ...(credential.transports && { transports: credential.transports }),
          user,
        })
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async findAllByEmail(email: string): Promise<AuthenticatorEntity[]> {
    try {
      return await this.authenticatorRepository.find({
        where: { user: { email } },
      });
    } catch (err) {
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async findOneById(id: string): Promise<AuthenticatorEntity | null> {
    try {
      return await this.authenticatorRepository.findOne({ where: { id } });
    } catch (err) {
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async findOneByCredentialId(id: string): Promise<AuthenticatorEntity | null> {
    try {
      return await this.authenticatorRepository.findOne({
        where: { credentialId: id },
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  async deleteOneById(id: string): Promise<void> {
    const authenticator = await this.findOneById(id);
    if (!authenticator) {
      this.logger.error(
        idNotFoundLogMsg('delete', 'an', 'authenticator', 'ID', id)
      );
      throw new NotFoundException(
        idNotFoundErrorMsg('an', 'authenticator', 'an', 'ID', id)
      );
    }

    try {
      await this.authenticatorRepository.remove(authenticator);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }
}
