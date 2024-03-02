import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { UserInvitesEntity } from '@newbee/api/shared/data-access';

/**
 * The service that interacts with the `UserInvitesEntity`.
 */
@Injectable()
export class UserInvitesService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Finds the `UserInvitesEntity` in the database associated with the given email. Creates a new one if none exist.
   *
   * @param email The email to look for.
   *
   * @returns The associated `UserInvitesEntity` instance.
   */
  async findOrCreateOneByEmail(email: string): Promise<UserInvitesEntity> {
    let userInvites = await this.em.findOne(UserInvitesEntity, { email });
    if (userInvites) {
      return userInvites;
    }

    userInvites = new UserInvitesEntity(email);
    await this.em.persistAndFlush(userInvites);
    return userInvites;
  }

  /**
   * Deletes the given `UserInvitesEntity` and saves the changes to the database.
   *
   * @param userInvites The `UserInvitesEntity` instance to delete.
   */
  async delete(userInvites: UserInvitesEntity): Promise<void> {
    await this.em.removeAndFlush(userInvites);
  }
}
