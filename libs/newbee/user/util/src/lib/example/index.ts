import { testUser2 } from '@newbee/shared/util';
import type { EditUserForm } from '../interface';

const { name, displayName } = testUser2;

/**
 * An example instance of `EditUserForm`.
 * Strictly for use in testing.
 */
export const testEditUserForm1: EditUserForm = {
  name,
  displayName,
  phoneNumber: null,
};
