import {
  DocNoOrg,
  OrgMember,
  OrgRoleEnum,
  TeamMember,
  TeamRoleEnum,
  compareOrgRoles,
  compareTeamRoles,
} from '@newbee/shared/util';

/**
 * Whether the user has the permissions to edit a doc.
 *
 * @param doc The doc to edit.
 * @param orgMember The role the user has in the doc's org, if any.
 * @param teamMember The role the user has in the doc's team, if any.
 *
 * @returns `true` if they are the doc's maintainer, moderator in the org, or member in the team.
 */
export function userHasEditPermissions(
  doc: DocNoOrg,
  orgMember: OrgMember | null,
  teamMember: TeamMember | null,
): boolean {
  const { maintainer, team } = doc;
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
 * Whether the user has the permissions to mark the doc as up-to-date.
 *
 * @param doc The doc to check.
 * @param orgMember The role the user has in the doc's org, if any.
 * @param teamMember The role the user has in the doc's team, if any.
 *
 * @returns `true` if they are the maintainer of the post or an org/team moderator.
 */
export function userHasUpToDatePermissions(
  doc: DocNoOrg,
  orgMember: OrgMember | null,
  teamMember: TeamMember | null,
): boolean {
  const { maintainer } = doc;
  return !!(
    (orgMember &&
      (compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0 ||
        (maintainer && maintainer.orgMember.slug === orgMember.slug))) ||
    (teamMember &&
      compareTeamRoles(teamMember.role, TeamRoleEnum.Moderator) >= 0)
  );
}

/**
 * Whether the user has the permissions to delete the doc.
 *
 * @param doc The doc to check.
 * @param orgMember The role the user has in the doc's org, if any.
 * @param teamMember The role the user has in the doc's team, if any.
 *
 * @returns `true` if they are the maintainer of the post or an org/team moderator.
 */
export function userHasDeletePermissions(
  doc: DocNoOrg,
  orgMember: OrgMember | null,
  teamMember: TeamMember | null,
): boolean {
  return userHasUpToDatePermissions(doc, orgMember, teamMember);
}
