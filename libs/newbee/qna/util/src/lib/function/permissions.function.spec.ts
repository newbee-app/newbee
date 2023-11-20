import {
  OrgMember,
  OrgRoleEnum,
  QnaNoOrg,
  TeamMember,
  TeamRoleEnum,
  testOrgMember1,
  testQnaRelation1,
  testTeamMember1,
} from '@newbee/shared/util';
import {
  userHasAnswerPermissions,
  userHasDeletePermissions,
  userHasQuestionPermissions,
  userHasUpToDatePermissions,
} from './permissions.function';

describe('PermissionsFunction', () => {
  const noMaintainerQna: QnaNoOrg = { ...testQnaRelation1, maintainer: null };
  const noCreatorQna: QnaNoOrg = { ...testQnaRelation1, creator: null };
  const noCreatorMaintainerQna: QnaNoOrg = {
    ...testQnaRelation1,
    creator: null,
    maintainer: null,
  };
  const noTeamQna: QnaNoOrg = { ...testQnaRelation1, team: null };

  const memberOrgMember: OrgMember = { role: OrgRoleEnum.Member, slug: 'bad' };
  const memberTeamMember: TeamMember = { role: TeamRoleEnum.Member };

  type Combo = [QnaNoOrg, OrgMember | null, TeamMember | null];

  describe('userHasQuestionPermissions', () => {
    it('should return true if the user has right permissions', () => {
      const truthyCombos: Combo[] = [
        [testQnaRelation1, testOrgMember1, testTeamMember1],
        [noMaintainerQna, testOrgMember1, testTeamMember1],
        [noCreatorQna, testOrgMember1, testTeamMember1],
        [noCreatorMaintainerQna, testOrgMember1, testTeamMember1],
        [noTeamQna, testOrgMember1, testTeamMember1],
        [noTeamQna, testOrgMember1, null],
        [testQnaRelation1, { slug: 'bad', role: OrgRoleEnum.Moderator }, null],
        [testQnaRelation1, memberOrgMember, { role: TeamRoleEnum.Moderator }],
      ];
      truthyCombos.forEach(([qna, orgMember, teamMember]) => {
        expect(
          userHasQuestionPermissions(qna, orgMember, teamMember),
        ).toBeTruthy();
      });

      const falsyCombos: Combo[] = [
        [testQnaRelation1, null, null],
        [testQnaRelation1, memberOrgMember, memberTeamMember],
      ];
      falsyCombos.forEach(([qna, orgMember, teamMember]) => {
        expect(
          userHasQuestionPermissions(qna, orgMember, teamMember),
        ).toBeFalsy();
      });
    });
  });

  describe('userHasAnswerPermissions', () => {
    it('should return true if the user has right permissions', () => {
      const truthyCombos: Combo[] = [
        [testQnaRelation1, testOrgMember1, testTeamMember1],
        [noMaintainerQna, testOrgMember1, testTeamMember1],
        [noCreatorQna, testOrgMember1, testTeamMember1],
        [noCreatorMaintainerQna, testOrgMember1, testTeamMember1],
        [noTeamQna, testOrgMember1, testTeamMember1],
        [noTeamQna, testOrgMember1, null],
        [testQnaRelation1, { slug: 'bad', role: OrgRoleEnum.Moderator }, null],
        [testQnaRelation1, memberOrgMember, memberTeamMember],
        [noTeamQna, memberOrgMember, null],
      ];
      truthyCombos.forEach(([qna, orgMember, teamMember]) => {
        expect(
          userHasAnswerPermissions(qna, orgMember, teamMember),
        ).toBeTruthy();
      });

      const falsyCombos: Combo[] = [
        [testQnaRelation1, null, null],
        [testQnaRelation1, memberOrgMember, null],
      ];
      falsyCombos.forEach(([qna, orgMember, teamMember]) => {
        expect(
          userHasAnswerPermissions(qna, orgMember, teamMember),
        ).toBeFalsy();
      });
    });
  });

  describe('userHasUpToDatePermissions & userHasDeletePermissions', () => {
    it('should return true if the user has right permissions', () => {
      const truthyCombos: Combo[] = [
        [testQnaRelation1, testOrgMember1, testTeamMember1],
        [noMaintainerQna, testOrgMember1, testTeamMember1],
        [noCreatorQna, testOrgMember1, testTeamMember1],
        [noCreatorMaintainerQna, testOrgMember1, testTeamMember1],
        [noTeamQna, testOrgMember1, null],
        [testQnaRelation1, { slug: 'bad', role: OrgRoleEnum.Moderator }, null],
        [testQnaRelation1, memberOrgMember, { role: TeamRoleEnum.Moderator }],
      ];
      truthyCombos.forEach(([qna, orgMember, teamMember]) => {
        expect(
          userHasUpToDatePermissions(qna, orgMember, teamMember),
        ).toBeTruthy();
        expect(
          userHasDeletePermissions(qna, orgMember, teamMember),
        ).toBeTruthy();
      });

      const falsyCombos: Combo[] = [
        [testQnaRelation1, null, null],
        [testQnaRelation1, memberOrgMember, memberTeamMember],
        [noMaintainerQna, memberOrgMember, memberTeamMember],
        [noTeamQna, memberOrgMember, null],
      ];
      falsyCombos.forEach(([qna, orgMember, teamMember]) => {
        expect(
          userHasUpToDatePermissions(qna, orgMember, teamMember),
        ).toBeFalsy();
        expect(
          userHasDeletePermissions(qna, orgMember, teamMember),
        ).toBeFalsy();
      });
    });
  });
});
