import { Authenticator } from '@newbee/shared/util';
import {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
} from '@simplewebauthn/typescript-types';
import {
  Column,
  DeepPartial,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class AuthenticatorEntity implements Authenticator {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'text',
    unique: true,
  })
  credentialId!: string;

  @Column({ type: 'bytea' })
  credentialPublicKey!: Buffer;

  @Column({ type: 'bigint' })
  counter!: number;

  @Column({ length: 32 })
  credentialDeviceType!: CredentialDeviceType;

  @Column()
  credentialBackedUp!: boolean;

  @Column({ nullable: true })
  transports?: AuthenticatorTransportFuture[];

  @ManyToOne(() => UserEntity, (user) => user.authenticators)
  user!: Relation<UserEntity>;

  constructor(partial?: DeepPartial<AuthenticatorEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
