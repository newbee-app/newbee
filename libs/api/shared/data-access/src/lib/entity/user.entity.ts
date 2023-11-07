import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import type { User } from '@newbee/shared/util';
import { AuthenticatorEntity } from './authenticator.entity';
import { OrgMemberEntity } from './org-member.entity';
import { UserChallengeEntity } from './user-challenge.entity';
import { UserInvitesEntity } from './user-invites.entity';

/**
 * The MikroORM entity representing a `User`.
 */
@Entity()
export class UserEntity implements User {
  /**
   * The UUID of the given user.
   * `hidden` is on, so it will never be serialized.
   * No need for users to know what this value is.
   */
  @PrimaryKey({ hidden: true })
  id: string;

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
   * @inheritdoc
   */
  @Property({ type: 'string', nullable: true })
  displayName: string | null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'string', nullable: true })
  phoneNumber: string | null;

  /**
   * The `UserChallengeEntity` associated with the given user.
   * Acts as a hidden property, meaning it will never be serialized.
   * All actions are cascaded, so if the user is deleted, so is its assocaited challenge.
   */
  @OneToOne(() => UserChallengeEntity, (challenge) => challenge.user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  challenge: UserChallengeEntity;

  /**
   * The `UserInvitesEntity` associated with the given user.
   * Acts as a hidden property, meaning it will never be serialized.
   * All actions are cascaded, so if the user is deleted, so is its assocaited invites.
   */
  @OneToOne(() => UserInvitesEntity, (userInvite) => userInvite.user, {
    hidden: true,
    owner: true,
    cascade: [Cascade.ALL],
  })
  invites: UserInvitesEntity;

  /**
   * The `AuthenticatorEntity`s associated with the given user.
   * Acts as a hidden property, meaning it will never be serialized.
   * `orphanRemoval` is on, so if the user is deleted, so is its authenticators.
   * Additionally, if an authenticator is removed from the collection, it is also deleted.
   */
  @OneToMany(() => AuthenticatorEntity, (authenticator) => authenticator.user, {
    orphanRemoval: true,
    hidden: true,
  })
  authenticators = new Collection<AuthenticatorEntity>(this);

  /**
   * The organizations the user is a part of along with the role the user holds and the teams the user belongs to within that organization.
   * Acts as a hidden property, meaning it will never be serialized.
   * `orphanRemoval` is on, so if the user is deleted, so is its user organization entities.
   * Additionally, if a user organization is removed from the collection, it is also deleted.
   */
  @OneToMany(() => OrgMemberEntity, (organization) => organization.user, {
    hidden: true,
  })
  organizations = new Collection<OrgMemberEntity>(this);

  constructor(
    id: string,
    email: string,
    name: string,
    displayName: string | null,
    phoneNumber: string | null,
    challenge: string | null,
    invites: UserInvitesEntity,
  ) {
    this.id = id;
    this.email = email.toLowerCase();
    this.name = name;
    this.displayName = displayName;
    this.phoneNumber = phoneNumber;
    this.challenge = new UserChallengeEntity(this, challenge);
    this.invites = invites;
  }
}
