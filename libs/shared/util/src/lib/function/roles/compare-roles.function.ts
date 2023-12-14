import { OrgRoleEnum, TeamRoleEnum } from '../../enum';

/**
 * Compares the values of the 2 org roles.
 *
 * @param a The first org role.
 * @param b The second org role.
 *
 * @returns `-1` if `a < b`, `0` if `a === b` are equal, and `1` if `a > b`.
 */
export function compareOrgRoles(a: OrgRoleEnum, b: OrgRoleEnum): -1 | 0 | 1 {
  if (a === b) {
    return 0;
  } else if (a === OrgRoleEnum.Member || b === OrgRoleEnum.Owner) {
    return -1;
  }

  return 1;
}

/**
 * Compares the values of the 2 team roles.
 *
 * @param a The first team role.
 * @param b The second team role.
 *
 * @returns `-1` if `a < b`, `0` if `a === b` are equal, and `1` if `a > b`.
 */
export function compareTeamRoles(a: TeamRoleEnum, b: TeamRoleEnum): -1 | 0 | 1 {
  if (a === b) {
    return 0;
  } else if (a === TeamRoleEnum.Member || b === TeamRoleEnum.Owner) {
    return -1;
  }

  return 1;
}
