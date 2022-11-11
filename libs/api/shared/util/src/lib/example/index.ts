import { testUser1 } from '@newbee/shared/util';
import type { UserJwtPayload } from '../interface';

export const testUserJwtPayload1: UserJwtPayload = {
  email: testUser1.email,
  sub: testUser1.id,
};
