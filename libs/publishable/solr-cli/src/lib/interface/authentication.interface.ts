/**
 * The params for adding new users to the Solr instance's auth plugin.
 */
export interface AddUserParams {
  /**
   * Username to password mappings.
   */
  [username: string]: string;
}
