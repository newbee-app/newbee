import {
  OrgRoleEnum,
  TeamRoleEnum,
  ascOrgRoleEnum,
  ascTeamRoleEnum,
} from '../../enum';
import {
  generateLteOrgRoles,
  generateLteTeamRoles,
} from './generate-roles.function';

describe('generate roles', () => {
  describe('generateLteOrgRoles', () => {
    it('should generate an array of org roles', () => {
      expect(generateLteOrgRoles(OrgRoleEnum.Owner)).toEqual(ascOrgRoleEnum);
      expect(generateLteOrgRoles(OrgRoleEnum.Moderator)).toEqual([
        OrgRoleEnum.Member,
        OrgRoleEnum.Moderator,
      ]);
      expect(generateLteOrgRoles(OrgRoleEnum.Member)).toEqual([
        OrgRoleEnum.Member,
      ]);
    });
  });

  describe('generateLteTeamRoles', () => {
    it('should generate an array of team roles', () => {
      expect(generateLteTeamRoles(OrgRoleEnum.Member, null)).toEqual([]);
      expect(
        generateLteTeamRoles(OrgRoleEnum.Member, TeamRoleEnum.Owner),
      ).toEqual(ascTeamRoleEnum);
      expect(
        generateLteTeamRoles(OrgRoleEnum.Member, TeamRoleEnum.Moderator),
      ).toEqual([TeamRoleEnum.Member, TeamRoleEnum.Moderator]);
      expect(
        generateLteTeamRoles(OrgRoleEnum.Member, TeamRoleEnum.Member),
      ).toEqual([TeamRoleEnum.Member]);
      expect(generateLteTeamRoles(OrgRoleEnum.Owner, null)).toEqual(
        ascTeamRoleEnum,
      );
      expect(generateLteTeamRoles(OrgRoleEnum.Moderator, null)).toEqual(
        ascTeamRoleEnum,
      );
      expect(generateLteTeamRoles(OrgRoleEnum.Member, null)).toEqual([]);
    });
  });
});
