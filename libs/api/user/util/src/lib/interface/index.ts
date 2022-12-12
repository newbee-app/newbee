import { UserEntity } from '@newbee/api/shared/data-access';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * An object containing a `UserEntity` and its associated `PublicKeyCredentialCreationOptionsJSON`.
 * Used when first registering a user with WebAuthn authentication.
 */
export interface UserAndOptions {
  /**
   * A user.
   */
  user: UserEntity;

  /**
   * The options to be sent to the frontend to register a new authenticator for the user.
   */
  options: PublicKeyCredentialCreationOptionsJSON;
}
