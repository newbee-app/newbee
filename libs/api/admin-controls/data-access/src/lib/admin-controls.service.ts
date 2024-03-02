import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import {
  AdminControlsEntity,
  EntityService,
} from '@newbee/api/shared/data-access';
import { WaitlistMemberService } from '@newbee/api/waitlist-member/data-access';
import { UpdateAdminControlsDto } from '@newbee/shared/util';

/**
 * The service that interacts with the `AdminControlsEntity`.
 */
@Injectable()
export class AdminControlsService {
  constructor(
    private readonly em: EntityManager,
    private readonly entityService: EntityService,
    private readonly waitlistMemberService: WaitlistMemberService,
  ) {}

  /**
   * Update the admin controls and save the changes to the database.
   * If registration is being turned on, remove everyone from the waitlist and turn them into users.
   *
   * @param updateAdminControlsDto The new details for the admin controls.
   *
   * @returns The updated admin controls.
   * @throws {BadRequestException} `userEmailTakenBadRequest`. If the ORM throws a `UniqueConstraintViolationException`.
   */
  async update(
    updateAdminControlsDto: UpdateAdminControlsDto,
  ): Promise<AdminControlsEntity> {
    const { allowRegistration } = updateAdminControlsDto;
    let adminControls = await this.entityService.getAdminControls();
    adminControls = this.em.assign(adminControls, updateAdminControlsDto);

    if (allowRegistration) {
      await this.em.populate(adminControls, ['waitlist']);
      await this.waitlistMemberService.deleteAndCreateUsers(
        adminControls.waitlist.getItems(),
      );
    } else {
      await this.em.flush();
    }

    return adminControls;
  }
}
