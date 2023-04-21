import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { OrgMemberInviteEntity } from './org-member-invite.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing user invites.
 */
@Entity()
export class UserInvitesEntity {
  /**
   * The globally unique ID for the user invites.
   * `hidden` is on, so it will never be serialized.
   */
  @PrimaryKey({ hidden: true })
  id: string;

  /**
   * The email of the user who was invited.
   */
  @Property({ unique: true })
  email: string;

  /**
   * The user who was invited, if they have signed up.
   * `hidden` is on, so it will never be serialized.
   * `nullable` is on, so it will be `null` if the user has not signed up.
   */
  @OneToOne(() => UserEntity, (user) => user.invites, {
    hidden: true,
    nullable: true,
  })
  user: UserEntity | null = null;

  /**
   * The organizations the user was invited to.
   * `hidden` is on, so it will never be serialized.
   * `orphanRemoval` is on, so if the user invites object is deleted, the org member invites will be removed as well.
   * Additionally, if an org member invite is removed from the collection, it is also deleted.
   */
  @OneToMany(
    () => OrgMemberInviteEntity,
    (orgMemberInvite) => orgMemberInvite.userInvites,
    { hidden: true, orphanRemoval: true }
  )
  orgMemberInvites = new Collection<OrgMemberInviteEntity>(this);

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }

  /**
   * Prepares to delete this instance by calling `removeAll` on all of the entity's collections with `orphanRemoval` on.
   *
   * @throws {Error} Any of the errors `init` can throw.
   */
  async prepareToDelete(): Promise<void> {
    if (!this.orgMemberInvites.isInitialized()) {
      await this.orgMemberInvites.init();
    }

    this.orgMemberInvites.removeAll();
  }
}
