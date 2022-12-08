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

@Entity()
export class AuthenticatorEntity implements Authenticator {
  @PrimaryKey()
  id: string = v4();

  @Property({ type: 'text' })
  @Unique()
  credentialId!: string;

  @Property({ type: 'text' })
  credentialPublicKey!: string;

  @Property({ type: 'bigint' })
  counter!: number;

  @Property({ type: 'string', length: 32 })
  credentialDeviceType!: CredentialDeviceType;

  @Property()
  credentialBackedUp!: boolean;

  @Property({ type: types.array, nullable: true })
  transports: AuthenticatorTransportFuture[] | null = null;

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
