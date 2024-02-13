import { EntityManager } from '@mikro-orm/postgresql';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  AdminControlsEntity,
  UserInvitesEntity,
} from '@newbee/api/shared/data-access';
import { adminControlsId } from '@newbee/api/shared/util';
import { UserInvitesService } from '@newbee/api/user-invites/data-access';
import {
  UpdateAdminControlsDto,
  internalServerError,
} from '@newbee/shared/util';

/**
 * The service that interacts with the `AdminControlsEntity`.
 */
@Injectable()
export class AdminControlsService {
  /**
   * The logger to use when logging anything in this service.
   */
  private readonly logger = new Logger(AdminControlsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly userInvitesService: UserInvitesService,
  ) {}

  /**
   * Get the NewBee instance's admin controls.
   *
   * @returns The NewBee instance's admin controls.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async get(): Promise<AdminControlsEntity> {
    try {
      let adminControls = await this.em.findOne(
        AdminControlsEntity,
        adminControlsId,
      );
      if (adminControls) {
        return adminControls;
      }

      adminControls = new AdminControlsEntity();
      await this.em.persistAndFlush(adminControls);
      return adminControls;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Update the admin controls and save the changes to the database.
   *
   * @param updateAdminControlsDto The new details for the admin controls.
   *
   * @returns The updated admin controls.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async update(
    updateAdminControlsDto: UpdateAdminControlsDto,
  ): Promise<AdminControlsEntity> {
    let adminControls = await this.get();
    adminControls = this.em.assign(adminControls, updateAdminControlsDto);

    try {
      await this.em.flush();
      return adminControls;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Adds the following emails to the admin controls waitlist.
   *
   * @param emails The emails to add to the waitlist.
   *
   * @returns The updated admin controls.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async addToWaitlist(emails: string[]): Promise<AdminControlsEntity> {
    const userInvites = await Promise.all(
      emails.map(
        async (email) =>
          await this.userInvitesService.findOrCreateOneByEmail(email),
      ),
    );
    const adminControls = await this.get();
    adminControls.waitlist.add(userInvites);

    try {
      await this.em.flush();
      return adminControls;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }

  /**
   * Remove the following user invites from the admin controls waitlist.
   *
   * @param userInvites The user invites to remove from the waitlist.
   *
   * @returns The updated admin controls.
   * @throws {InternalServerErrorException} `internalServerError`. If the ORM throws an error.
   */
  async removeFromWaitlist(
    userInvites: UserInvitesEntity[],
  ): Promise<AdminControlsEntity> {
    const adminControls = await this.get();
    adminControls.waitlist.remove(userInvites);

    try {
      await this.em.flush();
      return adminControls;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(internalServerError);
    }
  }
}
