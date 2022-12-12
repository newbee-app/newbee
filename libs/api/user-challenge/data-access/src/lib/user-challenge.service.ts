import { EntityRepository, NotFoundError } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserChallengeEntity } from '@newbee/api/shared/data-access';
import {
  idNotFoundErrorMsg,
  internalServerErrorMsg,
} from '@newbee/api/shared/util';

/**
 * The service that interacts with the `UserChallengeEntity`.
 */
@Injectable()
export class UserChallengeService {
  private readonly logger = new Logger(UserChallengeService.name);

  constructor(
    @InjectRepository(UserChallengeEntity)
    private readonly userChallengeRepository: EntityRepository<UserChallengeEntity>
  ) {}

  /**
   * Finds the `UserChallengeEntity` in the database associated with the given ID.
   *
   * @param id The user challenge ID to look for.
   *
   * @returns The associated `UserChallengeEntity` instance.
   * @throws {NotFoundException} If the ORM throws a NotFoundError.
   * @throws {InternalServerErrorException} If the ORM throws any other type of error.
   */
  async findOneById(id: string): Promise<UserChallengeEntity> {
    try {
      return await this.userChallengeRepository.findOneOrFail(id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(
          idNotFoundErrorMsg('a', 'user challenge', 'an', 'ID', id)
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  /**
   * Finds the `UserChallengeEntity` in the database associated with the given email.
   *
   * @param email The email of the user whose challenge we're looking for.
   *
   * @returns The associated `UserChallengeEntity` instance.
   * @throws {NotFoundException} If the ORM throws a NotFoundError.
   * @throws {InternalServerErrorException} If the ORM throws any other type of error.
   */
  async findOneByEmail(email: string): Promise<UserChallengeEntity> {
    try {
      return await this.userChallengeRepository.findOneOrFail({
        user: { email },
      });
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(
          idNotFoundErrorMsg('a', 'user challenge', 'an', 'email', email)
        );
      }

      throw new InternalServerErrorException(internalServerErrorMsg);
    }
  }

  /**
   * Updates the given `UserChallengeEntity` and saves the changes to the database.
   *
   * @param userChallenge The `UserChallengeEntity` instance to update.
   * @param challenge The new challenge string.
   *
   * @returns The updated `UserChallengeEntity` instance.
   */
  async update(
    userChallenge: UserChallengeEntity,
    challenge: string | null
  ): Promise<UserChallengeEntity> {
    const updatedUserChallenge = this.userChallengeRepository.assign(
      userChallenge,
      { challenge }
    );
    await this.userChallengeRepository.flush();
    return updatedUserChallenge;
  }

  /**
   * Finds a `UserChallengeEntity` by ID, updates it, and saves the changes to the database.
   *
   * @param id The user challenge ID to look for.
   * @param challenge The new challenge string.
   * @returns The updated `UserChallengeEntity` instance.
   */
  async updateById(
    id: string,
    challenge: string | null
  ): Promise<UserChallengeEntity> {
    let userChallenge = await this.findOneById(id);
    userChallenge = await this.update(userChallenge, challenge);
    return userChallenge;
  }

  /**
   * Finds a `UserChallengeEntity` by the user's email, updates it, and saves the changes to the database.
   *
   * @param email The email of the user whose challenge we're looking for.
   * @param challenge The new chllange string.
   * @returns The updated `UserChallengeEntity` instance.
   */
  async updateByEmail(
    email: string,
    challenge: string | null
  ): Promise<UserChallengeEntity> {
    let userChallenge = await this.findOneByEmail(email);
    userChallenge = await this.update(userChallenge, challenge);
    return userChallenge;
  }
}
