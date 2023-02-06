/**
 * A DTO for sending a team name value from the frontend to the backend.
 * Suitable for use in any request method.
 */
export class BaseTeamNameDto {
  /**
   * The team name to be transported.
   */
  teamName?: string;
}
