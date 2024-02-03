import {
  ConditionalRoleEnum,
  OrgRoleEnum,
  PostRoleEnum,
  TeamRoleEnum,
  UserRoleEnum,
} from '../../enum';
import { OrgMember } from '../../interface';
import { RoleType } from '../../type';
import { compareOrgRoles, compareTeamRoles } from './compare-roles.function';

/**
 * The options object to use in the `checkRoles` function.
 */
interface CheckRolesOptions {
  /**
   * The user role for the user attempting to make the request.
   */
  userRole?: UserRoleEnum | null | undefined;

  /**
   * The org member attempting to make the request.
   */
  orgMember?: OrgMember | null | undefined;

  /**
   * The team role for the user attempting to make the request.
   */
  teamRole?: TeamRoleEnum | null | undefined;

  /**
   * The affected user's org role.
   */
  subjectOrgRole?: OrgRoleEnum | null | undefined;

  /**
   * The affected user's team role.
   */
  subjectTeamRole?: TeamRoleEnum | null | undefined;

  /**
   * Whether there is a team related to the request.
   */
  team?: boolean | null | undefined;

  /**
   * The creator of the affected post.
   */
  postCreator?: OrgMember | null | undefined;

  /**
   * The maintainer of the affected post.
   */
  postMaintainer?: OrgMember | null | undefined;
}

/**
 * A function to check whether a user has the role permissions necessary to perform a task.
 *
 * @param roles The roles to accept.
 * @param options The options to feed in.
 *
 * @returns `true` if the user has the permissions to make the request, `false` otherwise.
 */
export function checkRoles(
  roles: RoleType[] | Set<RoleType>,
  options: CheckRolesOptions,
): boolean {
  /**
   * A helper function to check if `roles` contains the given `role`, to account for the fact that `roles` can be an array or set.
   *
   * @param roles The roles to check.
   * @param role The role to look for.
   *
   * @returns `true` if `role` is in `roles`, `false` otherwise.
   */
  const checkRole = (
    roles: RoleType[] | Set<RoleType>,
    role: RoleType,
  ): boolean => {
    return Array.isArray(roles) ? roles.includes(role) : roles.has(role);
  };

  const {
    userRole,
    orgMember,
    teamRole,
    subjectOrgRole,
    subjectTeamRole,
    team,
    postCreator,
    postMaintainer,
  } = options;
  const orgRole = orgMember?.role;

  return !!(
    (userRole && checkRole(roles, userRole)) ||
    (orgRole &&
      (checkRole(roles, orgRole) ||
        (!team && checkRole(roles, ConditionalRoleEnum.OrgMemberIfNoTeam))) &&
      (!checkRole(roles, ConditionalRoleEnum.OrgRoleGteSubject) ||
        (subjectOrgRole && compareOrgRoles(orgRole, subjectOrgRole) >= 0))) ||
    (teamRole &&
      checkRole(roles, teamRole) &&
      (!checkRole(roles, ConditionalRoleEnum.TeamRoleGteSubject) ||
        (subjectTeamRole &&
          compareTeamRoles(teamRole, subjectTeamRole) >= 0))) ||
    (orgMember &&
      ((postCreator &&
        checkRole(roles, PostRoleEnum.Creator) &&
        orgMember.slug === postCreator.slug) ||
        (postMaintainer &&
          checkRole(roles, PostRoleEnum.Maintainer) &&
          orgMember.slug === postMaintainer.slug)))
  );
}
