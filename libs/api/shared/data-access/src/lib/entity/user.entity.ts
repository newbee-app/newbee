import { User } from '@newbee/shared/util';
import {
  Column,
  DeepPartial,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { AuthenticatorEntity } from './authenticator.entity';
import { UserSettingsEntity } from './user-settings.entity';

@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  displayName!: string;

  @Column({ nullable: true, length: 32 })
  phoneNumber!: string;

  @Column()
  active!: boolean;

  @Column()
  online!: boolean;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings!: Relation<UserSettingsEntity>;

  @OneToMany(() => AuthenticatorEntity, (authenticator) => authenticator.user)
  authenticators!: Relation<AuthenticatorEntity[]>;

  constructor(partial?: DeepPartial<UserEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
