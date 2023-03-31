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
 * All of the possible values for `entry_type` in the NewBee Solr schema.
 */
export enum SolrEntryEnum {
  Doc = 'doc',
  Qna = 'qna',
  Team = 'team',
  User = 'user',
}
