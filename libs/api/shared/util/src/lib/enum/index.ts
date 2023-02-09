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
 * All of the possible roles a user can have.
 */
export type RoleType = OrgRoleEnum | TeamRoleEnum | PostRoleEnum;
