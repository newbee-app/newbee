import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@newbee/shared/util';
import { ROLE_KEY } from '../constant';

/**
 * The decorator used to mark a controller function as requiring specific roles.
 * Needs to be paired with a guard that makes use of this metadata, otherwise it will do nothing.
 * Meeting any of the specified roles should allow access.
 *
 * @param roles All of the roles that grant access to the endpoint.
 */
export const Role = (roles: RoleType | RoleType[]) =>
  SetMetadata(ROLE_KEY, Array.isArray(roles) ? roles : [roles]);
