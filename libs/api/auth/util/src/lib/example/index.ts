import { testUserEntity1 } from '@newbee/api/shared/data-access';
import type { UserJwtPayload } from '../interface';

/**
 * An example instance of `UserJwtPayload`.
 * Strictly for use in testing.
 */
export const testUserJwtPayload1: UserJwtPayload = {
  sub: testUserEntity1.id,
};
