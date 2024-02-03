import {
  Cascade,
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { UserRoleEnum, ascUserRoleEnum, type User } from '@newbee/shared/util';
import { AuthenticatorEntity } from './authenticator.entity';
import { CommonEntity } from './common.abstract.entity';
import { OrgMemberEntity } from './org-member.entity';
import { UserInvitesEntity } from './user-invites.entity';

/**
 * The MikroORM entity representing a `User`.
 */
@Entity()
export class UserEntity extends CommonEntity implements User {
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
  @Property({ nullable: true })
  displayName: string | null;

  /**
   * @inheritdoc
   */
  @Property({ nullable: true, length: 50 })
  phoneNumber: string | null;

  /**
   * @inheritdoc
   */
  @Enum({ items: () => UserRoleEnum, customOrder: ascUserRoleEnum })
  role: UserRoleEnum;

  /**
   * @inheritdoc
   */
  @Property({ type: 'boolean' })
  emailVerified = false;

  /**
   * When the user verification email was last sent.
   * Acts as a hidden property, meaning it will never be serialized.
   */
  @Property({ type: 'datetime', nullable: true, hidden: true })
  verifyEmailLastSentAt: Date | null = null;

  /**
   * The challenge associated with the given user.
   * `hidden` is on, so it will never be serialized.
   */
  @Property({ nullable: true, hidden: true })
  challenge: string | null;

  /**
   * The `UserInvitesEntity` associated with the given user.
   * `hidden` is on, so it will never be serialized.
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
    role: UserRoleEnum,
    invites: UserInvitesEntity,
  ) {
    super(id);

    this.email = email.toLowerCase();
    this.name = name;
    this.displayName = displayName;
    this.phoneNumber = phoneNumber;
    this.challenge = challenge;
    this.role = role;
    this.invites = invites;
  }
}
