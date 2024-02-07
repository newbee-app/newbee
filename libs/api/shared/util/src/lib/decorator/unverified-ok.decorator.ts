import { SetMetadata } from '@nestjs/common';
import { UNVERIFIED_OK_KEY } from '../constant';

/**
 * The decorator used to mark a controller function as OK to access without email verification past the verification time limit.
 */
export const UnverifiedOk = (allow?: boolean) =>
  SetMetadata(UNVERIFIED_OK_KEY, allow ?? true);
