import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
} from '@simplewebauthn/typescript-types';

/**
 * A device compatible for use in authentication using WebAuthn.
 * Stored as an entity in the backend.
 */
export interface Authenticator {
  /**
   * The globally unique ID for the authenticator.
   */
  id: string;

  /**
   * An optional human-readable name to attach to the authenticator.
   */
  name: string | null;

  /**
   * The globally unique ID of the authenticator's credential.
   */
  credentialId: string;

  /**
   * The public key associated with the authenticator's credential.
   */
  credentialPublicKey: string;

  /**
   * The number of times the authenticator has been used on this site so far.
   * Allows Relying Parties to identify misbehaving or cloned authenticators.
   */
  counter: number;

  /**
   * The type of credential associated with the authenticator.
   * This is really a string value.
   */
  credentialDeviceType: CredentialDeviceType;

  /**
   * Whether the credential of the authenticator has been backed up.
   */
  credentialBackedUp: boolean;

  /**
   * The transports associated with the authenticator.
   * This is really a list of string values.
   */
  transports: AuthenticatorTransportFuture[] | null;
}
