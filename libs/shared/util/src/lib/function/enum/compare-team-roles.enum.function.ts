import { TeamRoleEnum } from '../../enum';

export function compareTeamRoles(a: TeamRoleEnum, b: TeamRoleEnum): -1 | 0 | 1 {
  if (a === b) {
    return 0;
  }

  if (a === TeamRoleEnum.Member || b === TeamRoleEnum.Owner) {
    return -1;
  }

  return 1;
}
