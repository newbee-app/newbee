import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserInvitesEntity } from '@newbee/api/shared/data-access';
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
    @InjectRepository(UserInvitesEntity)
    private readonly userInvitesRepository: EntityRepository<UserInvitesEntity>
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
      const userInvites = await this.userInvitesRepository.findOne({ email });
      if (userInvites) {
        return userInvites;
      }

      const newUserInvites = new UserInvitesEntity(v4(), email);
      await this.userInvitesRepository.persistAndFlush(newUserInvites);
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
   */
  async delete(userInvites: UserInvitesEntity): Promise<void> {
    try {
      await userInvites.removeAllCollections();
      await this.userInvitesRepository.removeAndFlush(userInvites);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }
}
