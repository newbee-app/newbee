import {
  OrgMember,
  OrgRoleEnum,
  QnaNoOrg,
  TeamMember,
  TeamRoleEnum,
  compareOrgRoles,
  compareTeamRoles,
} from '@newbee/shared/util';

/**
 * Whether the user has the permissions to edit the question portion of a qna.
 *
 * @param qna The qna to check.
 * @param orgMember The role the user has in the qna's org, if any.
 * @param teamMember The role the user has in the qna's team, if any.
 *
 * @returns `true` if they are the creator or maintainer of the post, an org moderator, or is a team member.
 */
export function userHasQuestionPermissions(
  qna: QnaNoOrg,
  orgMember: OrgMember | null,
  teamMember: TeamMember | null,
): boolean {
  const { creator, maintainer } = qna;
  return !!(
    (orgMember &&
      (compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0 ||
        (maintainer && maintainer.orgMember.slug === orgMember.slug) ||
        (creator &&
          creator.orgMember.slug === orgMember.slug &&
          !qna.qna.answerMarkdoc &&
          !qna.qna.answerHtml))) ||
    (teamMember &&
      compareTeamRoles(teamMember.role, TeamRoleEnum.Moderator) >= 0)
  );
}

/**
 * Whether the user has the permissions to edit the answer portion of a qna.
 *
 * @param qna The qna to check.
 * @param orgMember The role the user has in the qna's org, if any.
 * @param teamMember The role the user has in the qna's team, if any.
 *
 * @returns `true` if they are the maintainer of the post, an org moderator, or a team member.
 */
export function userHasAnswerPermissions(
  qna: QnaNoOrg,
  orgMember: OrgMember | null,
  teamMember: TeamMember | null,
): boolean {
  const { maintainer, team } = qna;
  return !!(
    (orgMember &&
      (compareOrgRoles(
        orgMember.role,
        team ? OrgRoleEnum.Moderator : OrgRoleEnum.Member,
      ) >= 0 ||
        (maintainer && maintainer.orgMember.slug === orgMember.slug))) ||
    (teamMember && compareTeamRoles(teamMember.role, TeamRoleEnum.Member) >= 0)
  );
}

/**
 * Whether the user has the permissions to mark the qna as up-to-date.
 *
 * @param qna The qna to check.
 * @param orgMember The role the user has in the qna' org, if any.
 * @param teamMember The role the user has in the qna's team, if any.
 *
 * @returns `true` if they are the maintainer of the post or an org/team moderator.
 */
export function userHasUpToDatePermissions(
  qna: QnaNoOrg,
  orgMember: OrgMember | null,
  teamMember: TeamMember | null,
): boolean {
  const { maintainer } = qna;
  return !!(
    (orgMember &&
      (compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0 ||
        (maintainer && maintainer.orgMember.slug === orgMember.slug))) ||
    (teamMember &&
      compareTeamRoles(teamMember.role, TeamRoleEnum.Moderator) >= 0)
  );
}

/**
 * Whether the user has the permissions to delete the qna.
 *
 * @param qna The qna to check.
 * @param orgMember The role the user has in the qna's org, if any.
 * @param teamMember The role the user has in the qna's team, if any.
 *
 * @returns `true` if they are the maintainer of the post or an org/team moderator.
 */
export function userHasDeletePermissions(
  qna: QnaNoOrg,
  orgMember: OrgMember | null,
  teamMember: TeamMember | null,
): boolean {
  return userHasUpToDatePermissions(qna, orgMember, teamMember);
}
