import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from '../constant';
import { OrgRoleEnum, TeamRoleEnum } from '../enum';

/**
 * All of the possible roles a user can have.
 */
export type RoleType = OrgRoleEnum | TeamRoleEnum;

/**
 * The decorator used to mark a controller function as requiring a specific role.
 * Needs to be paired with a guard that makes use of this metadata, otherwise it will do nothing.
 * Meeting any of the specified roles should allow access.
 *
 * @param roles All of the roles that grant access to the endpoint.
 */
export const Role = (...roles: RoleType[]) => SetMetadata(ROLE_KEY, roles);
