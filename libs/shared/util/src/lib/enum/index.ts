/**
 * All of the possible roles a user can have within an organization.
 */
export enum OrgRoleEnum {
  Member = 'Org Member',
  Moderator = 'Org Moderator',
  Owner = 'Org Owner',
}

/**
 * OrgRoleEnum as a set.
 */
export const orgRoleEnumSet: Set<string> = new Set(Object.values(OrgRoleEnum));

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
 * All of the possible values for `entry_type` in the NewBee Solr schema.
 */
export enum SolrEntryEnum {
  Doc = 'doc',
  Qna = 'qna',
  Team = 'team',
  User = 'user',
}
