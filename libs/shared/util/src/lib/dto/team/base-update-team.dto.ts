import { BaseCreateTeamDto } from './base-create-team.dto';

/**
 * The DTO sent from the frontend to the backend for updating a team's value.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateTeamDto implements Partial<BaseCreateTeamDto> {
  /**
   * @inheritdoc
   */
  name?: string;

  /**
   * @inheritdoc
   */
  slug?: string;

  /**
   * @inheritdoc
   */
  upToDateDuration?: string | null;
}
