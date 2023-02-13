import type { Team } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new team.
 * Suitable for use in POST requests.
 */
export class BaseCreateTeamDto
  implements Omit<Team, 'slug'>, Partial<Pick<Team, 'slug'>>
{
  /**
   * @inheritdoc
   */
  name!: string;

  /**
   * @inheritdoc Leave undefined to auto-generate the slug.
   */
  slug?: string;
}
