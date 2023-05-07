/**
 * The information associated with a team.
 * Stored as an entity in the backend.
 */
export interface Team {
  /**
   * The unique name for the team, within an organization, as it will be displayed on the platform.
   */
  name: string;

  /**
   * The globally unique slug for the team, auto-generated based on the provided name.
   */
  slug: string;
}
