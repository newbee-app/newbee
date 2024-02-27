import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@newbee/shared/util';
import { IS_PUBLIC_KEY, ROLE_KEY, UNVERIFIED_OK_KEY } from '../constant';

/**
 * The decorator used to mark a controller function as public, meaning users don't need to be logged in to access the endpoint.
 */
export const Public = (isPublic?: boolean) =>
  SetMetadata(IS_PUBLIC_KEY, isPublic ?? true);

/**
 * The decorator used to mark a controller function as requiring specific roles.
 * Needs to be paired with a guard that makes use of this metadata, otherwise it will do nothing.
 * Meeting any of the specified roles should allow access.
 *
 * @param roles All of the roles that grant access to the endpoint.
 */
export const Role = (roles: RoleType | RoleType[]) =>
  SetMetadata(ROLE_KEY, Array.isArray(roles) ? roles : [roles]);

/**
 * The decorator used to mark a controller function as OK to access without email verification past the verification time limit.
 */
export const UnverifiedOk = (allow?: boolean) =>
  SetMetadata(UNVERIFIED_OK_KEY, allow ?? true);
