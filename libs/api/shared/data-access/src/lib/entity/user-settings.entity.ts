import { NameDisplayFormat, UserSettings } from '@newbee/shared/util';
import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class UserSettingsEntity implements UserSettings {
  @PrimaryColumn()
  userId!: string;

  @OneToOne(() => UserEntity, (user) => user.settings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: Relation<UserEntity>;

  @Column({
    type: 'enum',
    enum: NameDisplayFormat,
    default: NameDisplayFormat.FIRST_LAST,
  })
  nameDisplayFormat!: NameDisplayFormat;

  constructor(partial?: DeepPartial<UserSettingsEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
