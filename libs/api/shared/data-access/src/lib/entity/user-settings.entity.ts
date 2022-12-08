import { Entity, OneToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { UserSettings } from '@newbee/shared/util';
import { UserEntity } from './user.entity';

@Entity()
export class UserSettingsEntity implements UserSettings {
  @Property({ persist: false })
  get id(): string {
    return this.user.id;
  }

  @OneToOne(() => UserEntity, (user) => user.settings, {
    owner: true,
    primary: true,
    hidden: true,
  })
  user!: UserEntity;

  [PrimaryKeyType]?: string;

  constructor(partial?: Partial<UserSettingsEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
