import { SetMetadata } from '@nestjs/common';
import { ORG_ROLE_KEY } from '../constant';
import { OrganizationRole } from '../enum';

/**
 * The decorator used to mark a controller function as requiring a specific organization role.
 * Needs to be paired with a guard that makes use of this metadata, otherwise it will do nothing.
 * As an org member only has 1 role, meeting any of the specified org roles should allow access.
 *
 * @param roles The organization roles to require.
 */
export const OrgRole = (...roles: OrganizationRole[]) =>
  SetMetadata(ORG_ROLE_KEY, roles);
