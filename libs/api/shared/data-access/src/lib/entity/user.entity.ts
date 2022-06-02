import {
  Column,
  DeepPartial,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserSettings } from './user-settings.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  displayName!: string;

  @Column({ nullable: true })
  phoneNumber!: string;

  @Column()
  active!: boolean;

  @Column()
  online!: boolean;

  @OneToOne(() => UserSettings, (userSettings) => userSettings.user, {
    cascade: ['update'],
  })
  settings!: Relation<UserSettings>;

  constructor(partial?: DeepPartial<User>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
