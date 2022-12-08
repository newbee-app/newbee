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

@Entity()
export class UserEntity implements User {
  @PrimaryKey()
  id!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  name!: string;

  @Property({ type: 'string', nullable: true })
  displayName: string | null = null;

  @Property({ type: 'string', nullable: true })
  phoneNumber: string | null = null;

  @Property({ type: 'boolean' })
  active = true;

  @Property({ type: 'boolean' })
  online = false;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  settings!: UserSettingsEntity;

  @OneToOne(() => UserChallengeEntity, (challenge) => challenge.user, {
    cascade: [Cascade.ALL],
    hidden: true,
  })
  challenge!: UserChallengeEntity;

  @OneToMany(() => AuthenticatorEntity, (authenticator) => authenticator.user, {
    orphanRemoval: true,
    hidden: true,
  })
  authenticators = new Collection<AuthenticatorEntity>(this);

  [OptionalProps]?: 'active' | 'online';

  constructor(partial?: Partial<UserEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
