import {
  DocRelation,
  OrgMember,
  OrgRoleEnum,
  TeamMember,
  TeamRoleEnum,
  testDocRelation1,
  testOrgMember1,
  testTeamMember1,
} from '@newbee/shared/util';
import {
  userHasEditPermissions,
  userHasUpToDatePermissions,
} from './permissions.function';

describe('Permissions functions', () => {
  const orgModerator: OrgMember = { role: OrgRoleEnum.Moderator, slug: 'bad' };
  const orgMember: OrgMember = { role: OrgRoleEnum.Member, slug: 'bad' };
  const teamModerator: TeamMember = { role: TeamRoleEnum.Moderator };
  const teamMember: TeamMember = { role: TeamRoleEnum.Member };
  const memberMaintainer: OrgMember = {
    ...testOrgMember1,
    role: OrgRoleEnum.Member,
  };
  const memberCreator: OrgMember = {
    ...testOrgMember1,
    role: OrgRoleEnum.Member,
  };
  const docNullMaintainer: DocRelation = {
    ...testDocRelation1,
    maintainer: null,
  };
  const docNullCreator: DocRelation = { ...testDocRelation1, creator: null };
  const docNullTeam: DocRelation = { ...testDocRelation1, team: null };

  describe('userHasEditPermissions', () => {
    it('should return true if the user has right permissions', () => {
      expect(
        userHasEditPermissions(
          testDocRelation1,
          testOrgMember1,
          testTeamMember1,
        ),
      ).toBeTruthy();
      expect(
        userHasEditPermissions(testDocRelation1, testOrgMember1, null),
      ).toBeTruthy();
      expect(
        userHasEditPermissions(testDocRelation1, orgModerator, null),
      ).toBeTruthy();
      expect(
        userHasEditPermissions(testDocRelation1, orgMember, null),
      ).toBeFalsy();
      expect(
        userHasEditPermissions(testDocRelation1, null, testTeamMember1),
      ).toBeTruthy();
      expect(
        userHasEditPermissions(testDocRelation1, null, teamModerator),
      ).toBeTruthy();
      expect(
        userHasEditPermissions(testDocRelation1, null, teamMember),
      ).toBeTruthy();
      expect(
        userHasEditPermissions(docNullCreator, memberMaintainer, null),
      ).toBeTruthy();
      expect(
        userHasEditPermissions(docNullMaintainer, memberCreator, null),
      ).toBeFalsy();
      expect(userHasEditPermissions(docNullTeam, orgMember, null)).toBeTruthy();
    });
  });

  describe('userHasUpToDatePermissions & userHasDeletePermissions', () => {
    it('should return true if the user has right permissions', () => {
      expect(
        userHasUpToDatePermissions(
          testDocRelation1,
          testOrgMember1,
          testTeamMember1,
        ),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testDocRelation1, testOrgMember1, null),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testDocRelation1, orgModerator, null),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testDocRelation1, orgMember, null),
      ).toBeFalsy();
      expect(
        userHasUpToDatePermissions(testDocRelation1, null, testTeamMember1),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testDocRelation1, null, teamModerator),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testDocRelation1, null, teamMember),
      ).toBeFalsy();
      expect(
        userHasUpToDatePermissions(docNullCreator, memberMaintainer, null),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(docNullMaintainer, memberCreator, null),
      ).toBeFalsy();
    });
  });
});
