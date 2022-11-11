import { UserEntity } from '@newbee/api/shared/data-access';
import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

export interface UserAndOptions {
  user: UserEntity;
  options: PublicKeyCredentialCreationOptionsJSON;
}
