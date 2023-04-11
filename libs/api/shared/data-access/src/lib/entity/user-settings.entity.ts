import { Entity, OneToOne, PrimaryKeyType } from '@mikro-orm/core';
import type { UserSettings } from '@newbee/shared/util';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing a `UserSettings`.
 */
@Entity()
export class UserSettingsEntity implements UserSettings {
  /**
   * The `UserEntity` associated with the given user settings.
   * Acts as a hidden property, meaning it will never be serialized.
   */
  @OneToOne(() => UserEntity, (user) => user.settings, {
    owner: true,
    primary: true,
    hidden: true,
  })
  user: UserEntity;

  /**
   * Defines the type of the entity's primary key, which is a string in this case.
   */
  [PrimaryKeyType]?: string;

  constructor(user: UserEntity) {
    this.user = user;
  }
}
