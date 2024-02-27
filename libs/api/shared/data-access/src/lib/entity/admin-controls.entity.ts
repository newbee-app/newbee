import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { adminControlsId } from '@newbee/api/shared/util';
import { AdminControls } from '@newbee/shared/util';
import { CommonEntity } from './common.abstract.entity';
import { WaitlistMemberEntity } from './waitlist-member.entity';

/**
 * the MIkroORM entity representing admin controls.
 */
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
   * `orphanRemoval` is on, so if the member is removed from the waitlist, it is deleted.
   */
  @OneToMany(
    () => WaitlistMemberEntity,
    (waitlistMember) => waitlistMember.waitlist,
    { hidden: true, orphanRemoval: true },
  )
  waitlist = new Collection<WaitlistMemberEntity>(this);

  constructor() {
    super(adminControlsId);
  }
}
