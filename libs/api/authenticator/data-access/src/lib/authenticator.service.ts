import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticatorEntity,
  UserEntity,
} from '@newbee/api/shared/data-access';
import { challengeFalsy, type AppConfig } from '@newbee/api/shared/util';
import { UserService } from '@newbee/api/user/data-access';
import {
  authenticatorCredentialIdNotFound,
  authenticatorIdNotFound,
  authenticatorTakenBadRequest,
  authenticatorVerifyBadRequest,
  forbiddenError,
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
    private readonly em: EntityManager,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly userService: UserService,
  ) {}

  /**
   * Generate options for registering a new authenticator for the given user.
   *
   * @param user The user to generate options for.
   *
   * @returns The options to register the frontend's authenticator.
   */
  async generateOptions(
    user: UserEntity,
  ): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const authenticators: PublicKeyCredentialDescriptorFuture[] = (
      await this.findAllByEmail(user.email)
    ).map(({ credentialId, transports }) => ({
      id: Buffer.from(credentialId, 'base64url'),
      type: 'public-key',
      ...(transports && { transports }),
    }));

    const rpInfo = this.configService.get('rpInfo', { infer: true });
    const options = await generateRegistrationOptions({
      rpName: rpInfo.name,
      rpID: rpInfo.id,
      userID: user.id,
      userName: user.email,
      userDisplayName: user.displayName ?? user.name,
      excludeCredentials: authenticators,
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'required',
      },
    });

    await this.userService.update(user, { challenge: options.challenge });
    return options;
  }

  /**
   * Verifies the user's authenticator's challenge response and saves the authenticator to the backend, if valid.
   *
   * @param response The credential for the user's authenticator.
   * @param user The user to associate the authenticator with.
   *
   * @returns The newly created authenticator.
   * @throws {BadRequestException} `authenticatorVerifyBadRequest`, `authenticatorTakenBadRequest`. If the authenticator cannot be verified or it's already being used.
   */
  async create(
    response: RegistrationResponseJSON,
    user: UserEntity,
  ): Promise<AuthenticatorEntity> {
    const { challenge } = user;
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
      user,
    );
    try {
      await this.em.persistAndFlush(authenticator);
      return authenticator;
    } catch (err) {
      if (err instanceof UniqueConstraintViolationException) {
        this.logger.error(err);
        throw new BadRequestException(authenticatorTakenBadRequest);
      }

      throw err;
    }
  }

  /**
   * Finds all of the authenticators in the database associated with the given user.
   *
   * @param user The user to look for.
   *
   * @returns The associated authenticator instances. An empty array if non could be found.
   */
  async findAllByUser(user: UserEntity): Promise<AuthenticatorEntity[]> {
    return await this.em.find(AuthenticatorEntity, { user });
  }

  /**
   * Finds all of the authenticators in the database associated with the given user email.
   *
   * @param email The user email to look for.
   *
   * @returns The associated authenticator instances. An empty array if none could be found.
   */
  async findAllByEmail(email: string): Promise<AuthenticatorEntity[]> {
    return await this.em.find(AuthenticatorEntity, { user: { email } });
  }

  /**
   * Finds an authenticator by the given ID.
   *
   * @param id The database ID of the authenticator to look for.
   *
   * @returns The assocaited authenticator instance.
   * @throws {NotFoundException} `authenticatorIdNotFound`. If the authenticator cannot be found.
   */
  async findOneById(id: string): Promise<AuthenticatorEntity> {
    const authenticator = await this.em.findOne(AuthenticatorEntity, id);
    if (!authenticator) {
      throw new NotFoundException(authenticatorIdNotFound);
    }
    return authenticator;
  }

  /**
   * Finds the authenticator in the database associated with the given credential ID.
   *
   * @param credentialId The credential ID to look for.
   *
   * @returns The associated authenticator instance.
   * @throws {NotFoundException} `authenticatorCredentialIdNotFound`. If the authenticator cannot be found.
   */
  async findOneByCredentialId(
    credentialId: string,
  ): Promise<AuthenticatorEntity> {
    const authenticator = await this.em.findOne(AuthenticatorEntity, {
      credentialId,
    });
    if (!authenticator) {
      throw new NotFoundException(authenticatorCredentialIdNotFound);
    }
    return authenticator;
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
   */
  async updateCounterById(
    id: string,
    counter: number,
    userId: string,
  ): Promise<AuthenticatorEntity> {
    let authenticator = await this.findOneById(id);
    if (authenticator.user.id !== userId) {
      throw new ForbiddenException(forbiddenError);
    }

    authenticator = this.em.assign(authenticator, {
      counter,
    });
    await this.em.flush();
    return authenticator;
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
   */
  async updateNameById(
    id: string,
    name: string | null,
    userId: string,
  ): Promise<AuthenticatorEntity> {
    let authenticator = await this.findOneById(id);
    if (authenticator.user.id !== userId) {
      throw new ForbiddenException(forbiddenError);
    }

    authenticator = this.em.assign(authenticator, {
      name,
    });
    await this.em.flush();
    return authenticator;
  }

  /**
   * Deltes an authenticator by ID and saves the changes to the database.
   *
   * @param id The authenticator ID to look for.
   * @param userId The ID of the user making the request.
   *
   * @throws {ForbiddenException} `forbiddenError`. If the authenticator's user ID and the given user IDs do not match.
   */
  async deleteOneById(id: string, userId: string): Promise<void> {
    const authenticator = await this.findOneById(id);
    if (authenticator.user.id !== userId) {
      throw new ForbiddenException(forbiddenError);
    }

    await this.em.removeAndFlush(authenticator);
  }
}
