import { Entity, OneToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { UserChallenge } from '@newbee/shared/util';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing a `UserChallenge`.
 */
@Entity()
export class UserChallengeEntity implements UserChallenge {
  /**
   * @inheritdoc
   */
  @Property({ type: 'string', nullable: true })
  challenge: string | null = null;

  /**
   * The `UserEntity` associated with the given user challenge.
   * Acts as a hidden property, meaning it will never be serialized.
   */
  @OneToOne(() => UserEntity, (user) => user.challenge, {
    owner: true,
    primary: true,
    hidden: true,
  })
  user: UserEntity;

  /**
   * Defines the type of the entity's primary key, which is a string in this case.
   */
  [PrimaryKeyType]?: string;

  constructor(user: UserEntity, challenge: string | null) {
    this.user = user;
    this.challenge = challenge;
  }
}
