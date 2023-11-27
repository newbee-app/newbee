import {
  OrgMember,
  OrgRoleEnum,
  QnaRelation,
  TeamMember,
  TeamRoleEnum,
  testOrgMember1,
  testQna1,
  testQnaRelation1,
  testTeamMember1,
} from '@newbee/shared/util';
import {
  userHasAnswerPermissions,
  userHasQuestionPermissions,
  userHasUpToDatePermissions,
} from './permissions.function';

describe('PermissionsFunction', () => {
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
  const qnaNullMaintainer: QnaRelation = {
    ...testQnaRelation1,
    maintainer: null,
  };
  const qnaNullCreator: QnaRelation = { ...testQnaRelation1, creator: null };
  const qnaNullTeam: QnaRelation = { ...testQnaRelation1, team: null };

  describe('userHasQuestionPermissions', () => {
    it('should return true if the user has right permissions', () => {
      expect(
        userHasQuestionPermissions(
          testQnaRelation1,
          testOrgMember1,
          testTeamMember1,
        ),
      ).toBeTruthy();
      expect(
        userHasQuestionPermissions(testQnaRelation1, testOrgMember1, null),
      ).toBeTruthy();
      expect(
        userHasQuestionPermissions(testQnaRelation1, orgModerator, null),
      ).toBeTruthy();
      expect(
        userHasQuestionPermissions(testQnaRelation1, orgMember, null),
      ).toBeFalsy();
      expect(
        userHasQuestionPermissions(testQnaRelation1, null, testTeamMember1),
      );
      expect(
        userHasQuestionPermissions(testQnaRelation1, null, teamModerator),
      ).toBeTruthy();
      expect(
        userHasQuestionPermissions(testQnaRelation1, null, teamMember),
      ).toBeFalsy();
      expect(
        userHasQuestionPermissions(qnaNullCreator, memberMaintainer, null),
      ).toBeTruthy();
      expect(
        userHasQuestionPermissions(qnaNullMaintainer, memberCreator, null),
      ).toBeFalsy();
      expect(
        userHasQuestionPermissions(
          {
            ...qnaNullMaintainer,
            qna: { ...testQna1, answerHtml: null, answerMarkdoc: null },
          },
          memberCreator,
          null,
        ),
      ).toBeTruthy();
    });
  });

  describe('userHasAnswerPermissions', () => {
    it('should return true if the user has right permissions', () => {
      expect(
        userHasAnswerPermissions(
          testQnaRelation1,
          testOrgMember1,
          testTeamMember1,
        ),
      ).toBeTruthy();
      expect(
        userHasAnswerPermissions(testQnaRelation1, orgModerator, null),
      ).toBeTruthy();
      expect(
        userHasAnswerPermissions(testQnaRelation1, orgMember, null),
      ).toBeFalsy();
      expect(
        userHasAnswerPermissions(testQnaRelation1, null, testTeamMember1),
      ).toBeTruthy();
      expect(
        userHasAnswerPermissions(testQnaRelation1, null, teamModerator),
      ).toBeTruthy();
      expect(
        userHasAnswerPermissions(testQnaRelation1, null, teamMember),
      ).toBeTruthy();
      expect(
        userHasAnswerPermissions(qnaNullTeam, orgMember, null),
      ).toBeTruthy();
      expect(
        userHasAnswerPermissions(qnaNullCreator, memberMaintainer, null),
      ).toBeTruthy();
      expect(
        userHasAnswerPermissions(qnaNullMaintainer, memberCreator, null),
      ).toBeFalsy();
    });
  });

  describe('userHasUpToDatePermissions & userHasDeletePermissions', () => {
    it('should return true if the user has right permissions', () => {
      expect(
        userHasUpToDatePermissions(
          testQnaRelation1,
          testOrgMember1,
          testTeamMember1,
        ),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testQnaRelation1, testOrgMember1, null),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testQnaRelation1, orgModerator, null),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testQnaRelation1, orgMember, null),
      ).toBeFalsy();
      expect(
        userHasUpToDatePermissions(testQnaRelation1, null, testTeamMember1),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testQnaRelation1, null, teamModerator),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(testQnaRelation1, null, teamMember),
      ).toBeFalsy();
      expect(
        userHasUpToDatePermissions(qnaNullCreator, memberMaintainer, null),
      ).toBeTruthy();
      expect(
        userHasUpToDatePermissions(qnaNullMaintainer, memberCreator, null),
      ).toBeFalsy();
    });
  });
});
