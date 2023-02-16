import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
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
  @Property({ type: 'text', unique: true })
  credentialId: string;

  /**
   * @inheritdoc
   */
  @Property({ type: 'text' })
  credentialPublicKey: string;

  /**
   * @inheritdoc
   */
  @Property({ type: 'bigint' })
  counter: number;

  /**
   * @inheritdoc
   */
  @Property({ type: 'string', length: 32 })
  credentialDeviceType: CredentialDeviceType;

  /**
   * @inheritdoc
   */
  @Property()
  credentialBackedUp: boolean;

  /**
   * @inheritdoc
   */
  @Property({ type: 'array', nullable: true })
  transports: AuthenticatorTransportFuture[] | null;

  /**
   * The `UserEntity` associated with the given authenticator.
   * Acts as a hidden property, meaning it will never be serialized.
   */
  @ManyToOne(() => UserEntity, {
    hidden: true,
  })
  user: UserEntity;

  constructor(
    credentialId: string,
    credentialPublicKey: string,
    counter: number,
    credentialDeviceType: CredentialDeviceType,
    credentialBackedUp: boolean,
    transports: AuthenticatorTransportFuture[] | null,
    user: UserEntity
  ) {
    this.credentialId = credentialId;
    this.credentialPublicKey = credentialPublicKey;
    this.counter = counter;
    this.credentialDeviceType = credentialDeviceType;
    this.credentialBackedUp = credentialBackedUp;
    this.transports = transports;
    this.user = user;
  }
}
