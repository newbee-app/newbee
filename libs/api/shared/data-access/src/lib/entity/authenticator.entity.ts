import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
  Unique,
} from '@mikro-orm/core';
import { Authenticator } from '@newbee/shared/util';
import {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
} from '@simplewebauthn/typescript-types';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing a WebAuthn `Authenticator`.
 */
@Entity()
export class AuthenticatorEntity implements Authenticator {
  /**
   * @inheritdoc
   */
  @PrimaryKey()
  id: string = v4();

  /**
   * @inheritdoc
   */
  @Property({ type: 'text' })
  @Unique()
  credentialId!: string;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text' })
  credentialPublicKey!: string;

  /**
   * @inheritdoc
   */
  @Property({ type: 'bigint' })
  counter!: number;

  /**
   * @inheritdoc
   */
  @Property({ type: 'string', length: 32 })
  credentialDeviceType!: CredentialDeviceType;

  /**
   * @inheritdoc
   */
  @Property()
  credentialBackedUp!: boolean;

  /**
   * @inheritdoc
   */
  @Property({ type: types.array, nullable: true })
  transports: AuthenticatorTransportFuture[] | null = null;

  /**
   * The `UserEntity` associated with the given authenticator.
   * Acts as a hidden property, meaning it will never be serialized.
   */
  @ManyToOne(() => UserEntity, {
    hidden: true,
  })
  user!: UserEntity;

  constructor(partial?: Partial<AuthenticatorEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
