import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
} from '@simplewebauthn/typescript-types';
import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * A device compatible for use in authentication using WebAuthn.
 * Stored as an entity in the backend.
 */
export interface Authenticator extends CommonEntityFields {
  /**
   * The globally unique ID for the authenticator.
   */
  readonly id: string;

  /**
   * An optional human-readable name to attach to the authenticator.
   */
  readonly name: string | null;

  /**
   * The globally unique ID of the authenticator's credential.
   */
  readonly credentialId: string;

  /**
   * The public key associated with the authenticator's credential.
   */
  readonly credentialPublicKey: string;

  /**
   * The number of times the authenticator has been used on this site so far.
   * Allows Relying Parties to identify misbehaving or cloned authenticators.
   */
  readonly counter: number;

  /**
   * The type of credential associated with the authenticator.
   * This is really a string value.
   */
  readonly credentialDeviceType: CredentialDeviceType;

  /**
   * Whether the credential of the authenticator has been backed up.
   */
  readonly credentialBackedUp: boolean;

  /**
   * The transports associated with the authenticator.
   * This is really a list of string values.
   */
  readonly transports: AuthenticatorTransportFuture[] | null;
}
