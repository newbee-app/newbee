/**
 * All of the possible roles a user can have within a team.
 */
export enum TeamRoleEnum {
  Member = 'Team Member',
  Moderator = 'Team Moderator',
  Owner = 'Team Owner',
}

/**
 * TeamRoleEnum as a set.
 */
export const teamRoleEnumSet: Set<string> = new Set(
  Object.values(TeamRoleEnum)
);

/**
 * The ordering for TeamRoleEnum in ascending order.
 */
export const ascTeamRoleEnum = [
  TeamRoleEnum.Member,
  TeamRoleEnum.Moderator,
  TeamRoleEnum.Owner,
];
