/**
 * The information associated with a team.
 * Stored as an entity in the backend.
 */
export interface Team {
  /**
   * The unique name for the team, within an organization.
   */
  name: string;

  /**
   * How the team's name will be displayed on the platform, regardless of the value of name.
   * If the value is null, the team's name will be displayed.
   */
  displayName: string | null;
}
