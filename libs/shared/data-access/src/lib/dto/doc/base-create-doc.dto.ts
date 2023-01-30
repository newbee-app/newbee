import { Doc } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new Doc.
 * Suitable for use in POST requests.
 */
export class BaseCreateDocDto implements Pick<Doc, 'slug' | 'rawMarkdown'> {
  /**
   * @inheritdoc
   */
  slug!: string;

  /**
   * @inheritdoc
   */
  rawMarkdown!: string;
}