import { testUser1 } from '@newbee/shared/util';
import type { UserJwtPayload } from '../interface';

/**
 * An example instance of `UserJwtPayload`.
 * Strictly for use in testing.
 */
export const testUserJwtPayload1: UserJwtPayload = {
  sub: testUser1.id,
};
