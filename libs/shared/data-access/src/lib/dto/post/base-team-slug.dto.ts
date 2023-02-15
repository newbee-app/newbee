/**
 * A DTO for sending a team slug value from the frontend to the backend.
 * Suitable for use in any request method.
 */
export class BaseTeamSlugDto {
  /**
   * The team slug to be transported.
   */
  team?: string;
}
