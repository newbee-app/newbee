import { UserChallenge } from '@newbee/shared/util';
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
export class UserChallengeEntity implements UserChallenge {
  @PrimaryColumn()
  userId!: string;

  @Column({ nullable: true })
  challenge?: string | null;

  @OneToOne(() => UserEntity, (user) => user.challenge, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: Relation<UserEntity>;

  constructor(partial?: DeepPartial<UserChallengeEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
