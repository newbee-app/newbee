import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  EntityService,
  UserInvitesEntity,
} from '@newbee/api/shared/data-access';
import { internalServerError } from '@newbee/shared/util';
import { v4 } from 'uuid';

/**
 * The service that interacts with the `UserInvitesEntity`.
 */
@Injectable()
export class UserInvitesService {
  /**
   * The logger to use when logging anything in this service.
   */
  private readonly logger = new Logger(UserInvitesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly entityService: EntityService,
  ) {}

  /**
   * Finds the `UserInvitesEntity` in the database associated with the given email. Creates a new one if none exist.
   *
   * @param email The email to look for.
   *
   * @returns The associated `UserInvitesEntity` instance.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async findOrCreateOneByEmail(email: string): Promise<UserInvitesEntity> {
    try {
      const userInvites = await this.em.findOne(UserInvitesEntity, { email });
      if (userInvites) {
        return userInvites;
      }

      const newUserInvites = new UserInvitesEntity(v4(), email);
      await this.em.persistAndFlush(newUserInvites);
      return newUserInvites;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Deletes the given `UserInvitesEntity` and saves the changes to the database.
   *
   * @param userInvites The `UserInvitesEntity` instance to delete.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async delete(userInvites: UserInvitesEntity): Promise<void> {
    await this.entityService.safeToDelete(userInvites);
    try {
      await this.em.removeAndFlush(userInvites);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }
}
