/**
 * An interface representing a create team form.
 */
export interface CreateTeamForm {
  /**
   * The name of the team.
   */
  name: string | null;

  /**
   * The slug to use to represent the team.
   */
  slug: string | null;
}
