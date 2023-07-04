import { forbiddenError } from '@newbee/shared/util';
import type { HttpScreenError } from '../interface';

/**
 * An example instance of `HttpScreenError`.
 * Strictly for use in testing.
 */
export const testHttpScreenError1: HttpScreenError = {
  status: 403,
  message: forbiddenError,
};
