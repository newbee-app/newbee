/**
 * All of the possible values for `entry_type` in the NewBee Solr org schema.
 */
export enum SolrOrgEntryEnum {
  Doc = 'doc',
  Qna = 'qna',
  Team = 'team',
  User = 'user',
}

/**
 * All of the possible values for `entry_type` in the NewBee Solr app schema.
 */
export enum SolrAppEntryEnum {
  User = 'user',
  Waitlist = 'waitlist',
}
