import { OrgRoleEnum, TeamRoleEnum } from '../../enum';
import { compareOrgRoles, compareTeamRoles } from './compare-roles.function';

describe('compare roles', () => {
  describe('compareOrgRoles', () => {
    it('should get comparison correct', () => {
      const member = OrgRoleEnum.Member;
      const moderator = OrgRoleEnum.Moderator;
      const owner = OrgRoleEnum.Owner;

      expect(compareOrgRoles(member, member)).toEqual(0);
      expect(compareOrgRoles(moderator, moderator)).toEqual(0);
      expect(compareOrgRoles(owner, owner)).toEqual(0);

      expect(compareOrgRoles(member, moderator)).toEqual(-1);
      expect(compareOrgRoles(member, owner)).toEqual(-1);
      expect(compareOrgRoles(moderator, owner)).toEqual(-1);

      expect(compareOrgRoles(moderator, member)).toEqual(1);
      expect(compareOrgRoles(owner, member)).toEqual(1);
      expect(compareOrgRoles(owner, moderator)).toEqual(1);
    });
  });

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
});
