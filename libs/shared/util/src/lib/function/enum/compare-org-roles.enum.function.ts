import { OrgRoleEnum } from '../../enum';

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
  }

  if (a === OrgRoleEnum.Member || b === OrgRoleEnum.Owner) {
    return -1;
  }

  return 1;
}
