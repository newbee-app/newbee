import { Entity, OneToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { UserChallenge } from '@newbee/shared/util';
import { UserEntity } from './user.entity';

@Entity()
export class UserChallengeEntity implements UserChallenge {
  @Property({ persist: false })
  get id(): string {
    return this.user.id;
  }

  @Property({ type: 'string', nullable: true })
  challenge: string | null = null;

  @OneToOne(() => UserEntity, (user) => user.challenge, {
    owner: true,
    primary: true,
    hidden: true,
  })
  user!: UserEntity;

  [PrimaryKeyType]?: string;

  constructor(partial?: Partial<UserChallengeEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
