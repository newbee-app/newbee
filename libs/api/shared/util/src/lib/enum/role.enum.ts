import { OrgRoleEnum, TeamRoleEnum } from '@newbee/shared/util';

/**
 * All of the possible roles a user can have regarding posts.
 */
export enum PostRoleEnum {
  Creator = 'Post Creator',
  Maintainer = 'Post Owner',
}

/**
 * PostRoleEnum as a set.
 */
export const postRoleEnumSet: Set<string> = new Set(
  Object.values(PostRoleEnum),
);

/**
 * Some special cases for user roles that won't be saved to the database, but is useful in designating roles for API endpoints.
 */
export enum ConditionalRoleEnum {
  /**
   * Allow OrgRoleEnum.Member if there's no team specified in the request's params and there's no team associated with the request's post (if it's related to a post).
   */
  OrgMemberIfNoTeam = 'Org Member If No Team',

  /**
   * Allows PostRoleEnum.Creator if there's no answer associated with the qna.
   */
  CreatorIfNoAnswerInQna = 'Creator If No Answer In Qna',

  /**
   * Allows the request only if the requester's org role is >= the subject's org role.
   */
  OrgRoleGteSubject = 'Org Role Gte Subject',

  /**
   * Allows the request only if the requester's team role is >= the subject's team role.
   */
  TeamRoleGteSubject = 'Team Role Gte Subject',
}

/**
 * ConditionalRoleEnum as a set.
 */
export const conditionalRoleEnumSet: Set<string> = new Set(
  Object.values(ConditionalRoleEnum),
);

/**
 * All of the possible roles a user can have, for use in designating roles for API endpoints.
 */
export type RoleType =
  | OrgRoleEnum
  | TeamRoleEnum
  | PostRoleEnum
  | ConditionalRoleEnum;
