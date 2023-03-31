import { OrgRoleEnum, TeamRoleEnum } from '@newbee/shared/util';

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

  /**
   * Allows OrgRoleEnum.Member if there's no team associated with the doc.
   */
  OrgMemberIfNoTeamInDoc = 'Org Member If No Team In Doc',
}

/**
 * All of the possible roles a user can have, for use in designating roles for API endpoints.
 */
export type RoleType =
  | OrgRoleEnum
  | TeamRoleEnum
  | PostRoleEnum
  | ConditionalRoleEnum;
