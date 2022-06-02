import { NameDisplayFormat } from '@newbee/api/shared/util';
import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn()
  user!: Relation<User>;

  @Column({
    type: 'enum',
    enum: NameDisplayFormat,
    default: NameDisplayFormat.FIRST_LAST,
  })
  nameDisplayFormat!: NameDisplayFormat;

  constructor(partial?: DeepPartial<UserSettings>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
