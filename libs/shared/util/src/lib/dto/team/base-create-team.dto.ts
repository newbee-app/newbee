import type { CommonEntityFields, Team } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to create a new team.
 * Suitable for use in POST requests.
 */
export class BaseCreateTeamDto implements Omit<Team, keyof CommonEntityFields> {
  /**
   * @inheritdoc
   */
  name!: string;

  /**
   * @inheritdoc
   */
  slug!: string;

  /**
   * @inheritdoc
   */
  upToDateDuration: string | null = null;
}
