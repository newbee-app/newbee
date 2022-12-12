import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '@newbee/shared/util';
import { AuthenticatorEntity } from './authenticator.entity';
import { UserChallengeEntity } from './user-challenge.entity';
import { UserSettingsEntity } from './user-settings.entity';

/**
 * The MikroORM entity representing a `User`.
 */
@Entity()
export class UserEntity implements User {
  /**
   * @inheritdoc
   */
  @PrimaryKey()
  id!: string;

  /**
   * @inheritdoc
   */
  @Property({ unique: true })
  email!: string;

  /**
   * @inheritdoc
   */
  @Property()
  name!: string;

  /**
   * @inheritdoc
   */
  @Property({ type: 'string', nullable: true })
  displayName: string | null = null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'string', nullable: true })
  phoneNumber: string | null = null;

  /**
   * @inheritdoc
   */
  @Property({ type: 'boolean' })
  active = true;

  /**
   * @inheritdoc
   */
  @Property({ type: 'boolean' })
  online = false;

  /**
   * The `UserSettingsEntity` associated with the given user.
   * Acts as a hidden property, meaning it will never be serialized.
   * All actions are cascaded, so if the user is deleted, so is its assocaited settings.
   */
  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  settings!: UserSettingsEntity;

  /**
   * The `UserChallengeEntity` associated with the given user.
   * Acts as a hidden property, meaning it will never be serialized.
   * All actions are cascaded, so if the user is deleted, so is its assocaited challenge.
   */
  @OneToOne(() => UserChallengeEntity, (challenge) => challenge.user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  challenge!: UserChallengeEntity;

  /**
   * The `AuthenticatorEntity`s associated with the given user.
   * Acts as a hidden property, meaning it will never be serialized.
   * `orphanRemoval` is on, so if the user is deleted, so is its assocaited authenticator. Additionally, if an authenticator is removed from the collection, it is also deleted.
   */
  @OneToMany(() => AuthenticatorEntity, (authenticator) => authenticator.user, {
    orphanRemoval: true,
    hidden: true,
  })
  authenticators = new Collection<AuthenticatorEntity>(this);

  /**
   * All of the properties in the entity that are optional, even if they don't appear that way. In this case, it's `active` and `online`.
   */
  [OptionalProps]?: 'active' | 'online';

  constructor(partial?: Partial<UserEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
