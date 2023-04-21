import { OrgRoleEnum } from '../../enum';

export function compareOrgRoles(a: OrgRoleEnum, b: OrgRoleEnum): -1 | 0 | 1 {
  if (a === b) {
    return 0;
  }

  if (a === OrgRoleEnum.Member || b === OrgRoleEnum.Owner) {
    return -1;
  }

  return 1;
}
