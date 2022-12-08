import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
} from '@simplewebauthn/typescript-types';

export interface Authenticator {
  id: string;
  credentialId: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: CredentialDeviceType;
  credentialBackedUp: boolean;
  transports: AuthenticatorTransportFuture[] | null;
}
