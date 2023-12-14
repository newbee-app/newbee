/**
 * All of the possible roles a user can have within an organization.
 */
export enum OrgRoleEnum {
  Member = 'Org Member',
  Moderator = 'Org Moderator',
  Owner = 'Org Owner',
}

/**
 * OrgRoleEnum as a set.
 */
export const orgRoleEnumSet: Set<string> = new Set(Object.values(OrgRoleEnum));

/**
 * The ordering for OrgRoleEnum in ascending order.
 */
export const ascOrgRoleEnum = [
  OrgRoleEnum.Member,
  OrgRoleEnum.Moderator,
  OrgRoleEnum.Owner,
];

/**
 * For use in permissions, allow any org member to access a resource.
 */
export const anyOrgMember = ascOrgRoleEnum;

/**
 * For use in permissions, allow only org moderators and up to access a resource.
 */
export const atLeastOrgModerator = [OrgRoleEnum.Moderator, OrgRoleEnum.Owner];
