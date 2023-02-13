import type { Team } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend for updating a team's value.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateTeamDto implements Partial<Team> {
  /**
   * @inheritdoc
   */
  name?: string;

  /**
   * @inheritdoc
   */
  slug?: string;
}
