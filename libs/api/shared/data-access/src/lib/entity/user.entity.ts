import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  wrap,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import type { User } from '@newbee/shared/util';
import { AuthenticatorEntity } from './authenticator.entity';
import { OrgMemberEntity } from './org-member.entity';
import { UserChallengeEntity } from './user-challenge.entity';
import { UserInvitesEntity } from './user-invites.entity';
import { UserSettingsEntity } from './user-settings.entity';

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
   * The `UserSettingsEntity` associated with the given user.
   * Acts as a hidden property, meaning it will never be serialized.
   * All actions are cascaded, so if the user is deleted, so is its assocaited settings.
   */
  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  settings = new UserSettingsEntity(this);

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
    orphanRemoval: true,
  })
  organizations = new Collection<OrgMemberEntity>(this);

  constructor(
    id: string,
    email: string,
    name: string,
    displayName: string | null,
    phoneNumber: string | null,
    challenge: string | null,
    invites: UserInvitesEntity
  ) {
    this.id = id;
    this.email = email.toLowerCase();
    this.name = name;
    this.displayName = displayName;
    this.phoneNumber = phoneNumber;
    this.challenge = new UserChallengeEntity(this, challenge);
    this.invites = invites;
  }

  /**
   * Checks whether this instance of UserEntity is safe to delete and throws a `BadRequestException` if it's not.
   * If any of the orgs the user is a part of is not safe to delete, it is not safe to delete.
   * Otherwise, it's safe to delete.
   *
   * @param em The entity manager to use to find any necessary information from the database.
   * @throws {BadRequestException} `cannotDeleteMaintainerBadRequest`, `cannotDeleteOnlyTeamOwnerBadRequest`, `cannotDeleteOnlyOrgOwnerBadRequest`. If the org member still maintains any posts, any of the teams the user is in is not safe to delete, or the org member is the only owner of the org.
   * @throws {Error} Any of the errors `find` can throw.
   */
  async safeToDelete(em: EntityManager): Promise<void> {
    if (!this.organizations.isInitialized()) {
      await this.organizations.init();
    }
    for (const orgMember of this.organizations) {
      await orgMember.safeToDelete(em);
    }
  }

  /**
   * Prepare to delete this instance by calling `removeAll` on all of the entity's collections with `orphanRemoval` on.
   */
  async prepareToDelete(): Promise<void> {
    if (!wrap(this.invites).isInitialized()) {
      await wrap(this.invites).init();
    }
    await this.invites.prepareToDelete();

    const collections = [this.authenticators, this.organizations];
    for (const collection of collections) {
      if (!collection.isInitialized()) {
        await collection.init();
      }
    }

    for (const orgMember of this.organizations) {
      await orgMember.prepareToDelete();
    }

    for (const collection of collections) {
      collection.removeAll();
    }
  }
}
