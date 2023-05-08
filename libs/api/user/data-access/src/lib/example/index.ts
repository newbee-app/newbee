import { testUserEntity1 } from '@newbee/api/shared/data-access';
import { testPublicKeyCredentialCreationOptions1 } from '@newbee/shared/util';
import type { UserAndOptions } from '../interface';

/**
 * An example instance of UserAndOptions.
 * Strictly for use in testing.
 */
export const testUserAndOptions1: UserAndOptions = {
  user: testUserEntity1,
  options: testPublicKeyCredentialCreationOptions1,
};
