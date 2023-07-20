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
 * The ordering for OrgRoleEnum in ascending order.
 */
export const ascOrgRoleEnum = [
  OrgRoleEnum.Member,
  OrgRoleEnum.Moderator,
  OrgRoleEnum.Owner,
];

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

/**
 * All of the possible values for `entry_type` in the NewBee Solr schema.
 */
export enum SolrEntryEnum {
  Doc = 'doc',
  Qna = 'qna',
  Team = 'team',
  User = 'user',
}

/**
 * All of the locales supported by NewBee, represented as a string enum.
 * The key represents the country's region code, the value represents its corresponding locale string.
 */
export enum SupportedLocale {
  /**
   * United States - English
   */
  US = 'en-US',
}
