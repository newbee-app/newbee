/**
 * All of the possible roles a user can have within an organization.
 */
export enum OrgRoleEnum {
  Member = 'Org Member',
  Moderator = 'Org Moderator',
  Owner = 'Org Owner',
}

/**
 * All of the possible roles a user can have within a team.
 */
export enum TeamRoleEnum {
  Member = 'Team Member',
  Moderator = 'Team Moderator',
  Owner = 'Team Owner',
}

/**
 * All of the possible roles a user can have regarding posts.
 */
export enum PostRoleEnum {
  Creator = 'Post Creator',
  Maintainer = 'Post Owner',
}

/**
 * Some special cases for user roles that won't be saved to the database, but is useful in designating roles for API endpoints.
 */
export enum ConditionalRoleEnum {
  /**
   * Allow OrgRoleEnum.Member if there's no team specified in the request's query or body.
   */
  OrgMemberIfNoTeamInReq = 'Org Member If No Team In Req',

  /**
   * Allows OrgRoleEnum.Member if there's no team associated with the qna.
   */
  OrgMemberIfNoTeamInQna = 'Org Member If No Team In Qna',
}

/**
 * All of the possible roles a user can have, for use in designating roles for API endpoints.
 */
export type RoleType =
  | OrgRoleEnum
  | TeamRoleEnum
  | PostRoleEnum
  | ConditionalRoleEnum;
