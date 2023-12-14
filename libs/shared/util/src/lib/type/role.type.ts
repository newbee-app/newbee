import {
  ConditionalRoleEnum,
  OrgRoleEnum,
  PostRoleEnum,
  TeamRoleEnum,
} from '../enum';

/**
 * All of the possible roles a user can have, for use in designating roles for API endpoints.
 * Also allows array values.
 */
export type RoleType =
  | OrgRoleEnum
  | TeamRoleEnum
  | PostRoleEnum
  | ConditionalRoleEnum;
