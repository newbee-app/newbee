import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
  Unique,
} from '@mikro-orm/core';
import { Authenticator } from '@newbee/shared/util';
import type {
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
   * The globally unique ID for the authenticator.
   * `hidden` is on, so it will never be serialized.
   * No need for users to know what this value is.
   */
  @PrimaryKey({ hidden: true })
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

  constructor(
    credentialId: string,
    credentialPublicKey: string,
    counter: number,
    credentialDeviceType: CredentialDeviceType,
    credentialBackedUp: boolean,
    user: UserEntity,
    optional?: { transports?: AuthenticatorTransportFuture[] }
  ) {
    this.credentialId = credentialId;
    this.credentialPublicKey = credentialPublicKey;
    this.counter = counter;
    this.credentialDeviceType = credentialDeviceType;
    this.credentialBackedUp = credentialBackedUp;
    this.user = user;

    if (!optional) {
      return;
    }

    const { transports } = optional;
    if (transports) {
      this.transports = transports;
    }
  }
}
