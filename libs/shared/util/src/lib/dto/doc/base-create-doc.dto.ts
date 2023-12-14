import { Doc } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to create a new Doc.
 * Suitable for use in POST requests.
 */
export class BaseCreateDocDto
  implements Pick<Doc, 'title' | 'upToDateDuration' | 'docMarkdoc'>
{
  /**
   * @inheritdoc
   */
  title!: string;

  /**
   * @inheritdoc
   */
  upToDateDuration: string | null = null;

  /**
   * @inheritdoc
   */
  docMarkdoc!: string;

  /**
   * The slug of the team to put the doc in, if any.
   */
  team: string | null = null;
}
