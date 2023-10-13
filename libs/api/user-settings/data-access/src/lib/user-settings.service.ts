import { NotFoundError } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserSettingsEntity } from '@newbee/api/shared/data-access';
import {
  internalServerError,
  userSettingsIdNotFound,
} from '@newbee/shared/util';

/**
 * The service that interacts with the `UserSettingsEntity`.
 */
@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name);

  constructor(private readonly em: EntityManager) {}

  /**
   * Finds the `UserSettingsEntity` in the database associated with the given ID.
   *
   * @param id The user settings ID to look for.
   *
   * @returns The associated `UserSettingsEntity` instance.
   * @throws {NotFoundException} `userSettingsIdNotFound`. If the ORM throws a NotFoundError.
   * @throws {InternalServerErrorException} `internalServerError.`. If the ORM throws any other type of error.
   */
  async findOneById(id: string): Promise<UserSettingsEntity> {
    try {
      return await this.em.findOneOrFail(UserSettingsEntity, id);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof NotFoundError) {
        throw new NotFoundException(userSettingsIdNotFound);
      }

      throw new InternalServerErrorException(internalServerError);
    }
  }
}
