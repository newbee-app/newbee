import { TeamRoleEnum } from '../../enum';

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
  }

  if (a === TeamRoleEnum.Member || b === TeamRoleEnum.Owner) {
    return -1;
  }

  return 1;
}
