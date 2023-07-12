import {
  EntityRepository,
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticatorEntity,
  EntityService,
  UserEntity,
} from '@newbee/api/shared/data-access';
import type { AppConfig } from '@newbee/api/shared/util';
import { UserChallengeService } from '@newbee/api/user-challenge/data-access';
import {
  authenticatorCredentialIdNotFound,
  authenticatorIdNotFound,
  authenticatorTakenBadRequest,
  authenticatorVerifyBadRequest,
  challengeFalsy,
  forbiddenError,
  internalServerError,
} from '@newbee/shared/util';
import type { VerifiedRegistrationResponse } from '@simplewebauthn/server';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialDescriptorFuture,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types';

/**
 * The service that interacts with the `AuthenticatorEntity`.
 */
@Injectable()
export class AuthenticatorService {
  private readonly logger = new Logger(AuthenticatorService.name);

  constructor(
    @InjectRepository(AuthenticatorEntity)
    private readonly authenticatorRepository: EntityRepository<AuthenticatorEntity>,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly entityService: EntityService,
    private readonly userChallengeService: UserChallengeService
  ) {}

  /**
   * Generate options for registering a new authenticator for the given user.
   *
   * @param user The user to generate options for.
   *
   * @returns The options to register the frontend's authenticator.
   */
  async generateOptions(
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

  /**
   * Verifies the user's authenticator's challenge response and saves the authenticator to the backend, if valid.
   *
   * @param response The credential for the user's authenticator.
   * @param user The user to associate the authenticator with.
   *
   * @returns The newly created authenticator.
   * @throws {NotFoundException} `userChallengeIdNotFound`. If the user's challenge cannot be found.
   * @throws {BadRequestException} `authenticatorVerifyBadRequest`, `authenticatorTakenBadRequest`. If the authenticator cannot be verified or it's already being used.
   * @throws {InternalServerErrorException} `internalServerError`. For any other type of error.
   */
  async create(
    response: RegistrationResponseJSON,
    user: UserEntity
  ): Promise<AuthenticatorEntity> {
    const userChallenge = await this.userChallengeService.findOneById(user.id);
    const { challenge } = userChallenge;
    if (!challenge) {
      this.logger.error(challengeFalsy('registration', challenge, user.id));
      throw new BadRequestException(authenticatorVerifyBadRequest);
    }

    const rpInfo = this.configService.get('rpInfo', { infer: true });
    let verification: VerifiedRegistrationResponse;
    try {
      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: challenge,
        expectedOrigin: rpInfo.origin,
        expectedRPID: rpInfo.id,
      });
    } catch (err) {
      this.logger.error(err);

      throw new BadRequestException(authenticatorVerifyBadRequest);
    }

    const { verified, registrationInfo } = verification;
    if (!verified || !registrationInfo) {
      this.logger.error(`Could not verify credentials for user: ${user.id}`);
      throw new BadRequestException(authenticatorVerifyBadRequest);
    }
    const {
      credentialID,
      credentialPublicKey,
      counter,
      credentialDeviceType,
      credentialBackedUp,
    } = registrationInfo;

    const authenticator = new AuthenticatorEntity(
      Buffer.from(credentialID).toString('base64url'),
      Buffer.from(credentialPublicKey).toString('base64url'),
      counter,
      credentialDeviceType,
      credentialBackedUp,
      response.response.transports ?? null,
      user
    );
    try {
      await this.authenticatorRepository.persistAndFlush(authenticator);
      return authenticator;
    } catch (err) {
      this.logger.error(err);

      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(authenticatorTakenBadRequest);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds all of the authenticators in the database associated with the given user.
   *
   * @param user The user to look for.
   *
   * @returns The associated authenticator instances. An empty array if non could be found.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async findAllByUser(user: UserEntity): Promise<AuthenticatorEntity[]> {
    try {
      return await this.authenticatorRepository.find({ user });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds all of the authenticators in the database associated with the given user email.
   *
   * @param email The user email to look for.
   *
   * @returns The associated authenticator instances. An empty array if none could be found.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async findAllByEmail(email: string): Promise<AuthenticatorEntity[]> {
    try {
      return await this.authenticatorRepository.find({ user: { email } });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds an authenticator by the given ID.
   *
   * @param id The database ID of the authenticator to look for.
   *
   * @returns The assocaited authenticator instance.
   * @throws {NotFoundException} `authenticatorIdNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneById(id: string): Promise<AuthenticatorEntity> {
    try {
      return await this.authenticatorRepository.findOneOrFail(id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(authenticatorIdNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds the authenticator in the database associated with the given credential ID.
   *
   * @param credentialId The credential ID to look for.
   *
   * @returns The associated authenticator instance.
   * @throws {NotFoundException} `authenticatorCredentialIdNotFound`. If the ORM throws a `NotFoundError`.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other type of error.
   */
  async findOneByCredentialId(
    credentialId: string
  ): Promise<AuthenticatorEntity> {
    try {
      return await this.authenticatorRepository.findOneOrFail({ credentialId });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(authenticatorCredentialIdNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds an authenticator by ID, updates its counter, and saves the changes to the database.
   *
   * @param id The authenticator ID to look for.
   * @param counter The new counter value.
   * @param userId The ID of the user making the request.
   *
   * @returns The updated authenticator.
   * @throws {NotFoundException} `authenticatorIdNotFound`. If the authenticator cannot be found by the given ID.
   * @throws {ForbiddenException} `forbiddenError`. If the authenticator's user ID does not match the given user ID.
   * @throws {InternalServerErrorException} `internalServerError`. If any other error is thrown.
   */
  async updateCounterById(
    id: string,
    counter: number,
    userId: string
  ): Promise<AuthenticatorEntity> {
    let authenticator = await this.findOneById(id);
    if (authenticator.user.id !== userId) {
      throw new ForbiddenException(forbiddenError);
    }

    authenticator = this.authenticatorRepository.assign(authenticator, {
      counter,
    });
    try {
      await this.authenticatorRepository.flush();
      return authenticator;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Finds an authenticator by ID, checks whether the authenticator's user and the provided user IDs match, updates its name, and saves the changes to the database.
   *
   * @param id The authenticator ID to look for.
   * @param name The new name value for the authenticator.
   * @param userId The ID of the user making the request.
   *
   * @returns The updated authenticator.
   * @throws {NotFoundException} `authenticatorIdNotFound`. If the authenticator cannot be found by the given ID.
   * @throws {ForbiddenException} `forbiddenError`. If the authenticator's user and the provided user IDs do not match.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws any other error.
   */
  async updateNameById(
    id: string,
    name: string | null,
    userId: string
  ): Promise<AuthenticatorEntity> {
    let authenticator = await this.findOneById(id);
    if (authenticator.user.id !== userId) {
      throw new ForbiddenException(forbiddenError);
    }

    authenticator = this.authenticatorRepository.assign(authenticator, {
      name,
    });
    try {
      await this.authenticatorRepository.flush();
      return authenticator;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deltes an authenticator by ID and saves the changes to the database.
   *
   * @param id The authenticator ID to look for.
   * @param userId The ID of the user making the request.
   *
   * @throws {ForbiddenException} `forbiddenError`. If the authenticator's user ID and the given user IDs do not match.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async deleteOneById(id: string, userId: string): Promise<void> {
    const authenticator = await this.findOneById(id);
    if (authenticator.user.id !== userId) {
      throw new ForbiddenException(forbiddenError);
    }

    await this.entityService.safeToDelete(authenticator);
    try {
      await this.authenticatorRepository.removeAndFlush(authenticator);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }
}
