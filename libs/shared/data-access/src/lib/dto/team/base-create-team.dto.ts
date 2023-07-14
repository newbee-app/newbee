import type { Team } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new team.
 * Suitable for use in POST requests.
 */
export class BaseCreateTeamDto implements Team {
  /**
   * @inheritdoc
   */
  name!: string;

  /**
   * @inheritdoc
   */
  slug!: string;
}
