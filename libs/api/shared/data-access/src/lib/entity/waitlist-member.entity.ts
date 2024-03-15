import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { WaitlistMember } from '@newbee/shared/util';
import { AdminControlsEntity } from './admin-controls.entity';
import { CommonEntity } from './common.abstract.entity';

/**
 * The MikroORM entity representing a waitlist member.
 */
@Entity()
export class WaitlistMemberEntity
  extends CommonEntity
  implements WaitlistMember
{
  /**
   * @inheritdoc
   */
  @Property({ unique: true })
  email: string;

  /**
   * @inheritdoc
   */
  @Property()
  name: string;

  /**
   * The admin controls waitlist this waitlist member is attached to.
   * `hidden` is on, so it will never be serialized.
   */
  @ManyToOne(() => AdminControlsEntity, { hidden: true })
  waitlist: AdminControlsEntity;

  constructor(email: string, name: string, waitlist: AdminControlsEntity) {
    super();
    this.email = email;
    this.name = name;
    this.waitlist = waitlist;
  }
}