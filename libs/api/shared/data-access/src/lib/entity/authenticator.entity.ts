import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import type { Authenticator } from '@newbee/shared/util';
import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
} from '@simplewebauthn/typescript-types';
import { v4 } from 'uuid';
import { CommonEntity } from './common.abstract.entity';
import { UserEntity } from './user.entity';

/**
 * The MikroORM entity representing a WebAuthn `Authenticator`.
 */
@Entity()
export class AuthenticatorEntity extends CommonEntity implements Authenticator {
  /**
   * @inheritdoc
   */
  @Property({ nullable: true })
  name: string | null = null;

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
   * `hidden` is on, so it will never be serialized.
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
    user: UserEntity,
  ) {
    super(v4());

    this.credentialId = credentialId;
    this.credentialPublicKey = credentialPublicKey;
    this.counter = counter;
    this.credentialDeviceType = credentialDeviceType;
    this.credentialBackedUp = credentialBackedUp;
    this.transports = transports;
    this.user = user;
  }
}
