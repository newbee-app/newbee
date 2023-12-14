import {
  OrgRoleEnum,
  TeamRoleEnum,
  ascOrgRoleEnum,
  ascTeamRoleEnum,
} from '../../enum';
import { compareOrgRoles, compareTeamRoles } from './compare-roles.function';

/**
 * Generate an array of org roles that's <= the given role.
 *
 * @param role The org role to base off of.
 *
 * @returns An aray of org roles.
 */
export function generateLteOrgRoles(role: OrgRoleEnum): OrgRoleEnum[] {
  return ascOrgRoleEnum.filter((r) => compareOrgRoles(r, role) <= 0);
}

/**
 * Generate an array of team roles that's <= the given role.
 *
 * @param orgRole The org role to base off of.
 * @param teamRole The team role to base off of.
 *
 * @returns An array of team roles.
 */
export function generateLteTeamRoles(
  orgRole: OrgRoleEnum,
  teamRole: TeamRoleEnum | null,
): TeamRoleEnum[] {
  if (compareOrgRoles(orgRole, OrgRoleEnum.Moderator) >= 0) {
    return ascTeamRoleEnum;
  }

  return teamRole
    ? ascTeamRoleEnum.filter((r) => compareTeamRoles(r, teamRole) <= 0)
    : [];
}
