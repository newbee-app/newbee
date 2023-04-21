import { TeamRoleEnum } from '../../enum';
import { compareTeamRoles } from './compare-team-roles.enum.function';

describe('compareTeamRoles', () => {
  it('should get comparison correct', () => {
    const member = TeamRoleEnum.Member;
    const moderator = TeamRoleEnum.Moderator;
    const owner = TeamRoleEnum.Owner;

    expect(compareTeamRoles(member, member)).toEqual(0);
    expect(compareTeamRoles(moderator, moderator)).toEqual(0);
    expect(compareTeamRoles(owner, owner)).toEqual(0);

    expect(compareTeamRoles(member, moderator)).toEqual(-1);
    expect(compareTeamRoles(member, owner)).toEqual(-1);
    expect(compareTeamRoles(moderator, owner)).toEqual(-1);

    expect(compareTeamRoles(moderator, member)).toEqual(1);
    expect(compareTeamRoles(owner, member)).toEqual(1);
    expect(compareTeamRoles(owner, moderator)).toEqual(1);
  });
});
