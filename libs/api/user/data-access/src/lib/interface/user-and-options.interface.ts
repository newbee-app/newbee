import { UserEntity } from '@newbee/api/shared/data-access';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

/**
 * An interface containing a user entity and its webauthn registration options.
 */
export interface UserAndOptions {
  /**
   * The user entity.
   */
  user: UserEntity;

  /**
   * The user's public key credential creation options for use in webauthn.
   */
  options: PublicKeyCredentialCreationOptionsJSON;
}
