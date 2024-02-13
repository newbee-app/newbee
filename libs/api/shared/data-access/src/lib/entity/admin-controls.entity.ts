import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { adminControlsId } from '@newbee/api/shared/util';
import { AdminControls } from '@newbee/shared/util';
import { CommonEntity } from './common.abstract.entity';
import { UserInvitesEntity } from './user-invites.entity';

@Entity()
export class AdminControlsEntity extends CommonEntity implements AdminControls {
  /**
   * @inheritdoc
   */
  @Property({ type: 'boolean' })
  allowRegistration = true;

  /**
   * @inheritdoc
   */
  @Property({ type: 'boolean' })
  allowWaitlist = true;

  /**
   * The potential users who are on the NewBee instance's waitlist.
   * `hidden` is on, so it will never be serialized.
   */
  @OneToMany(
    () => UserInvitesEntity,
    (userInvites) => userInvites.adminControls,
    { hidden: true },
  )
  waitlist = new Collection<UserInvitesEntity>(this);

  constructor() {
    super(adminControlsId);
  }
}
