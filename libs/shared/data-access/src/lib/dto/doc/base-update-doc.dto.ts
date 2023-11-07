import { BaseCreateDocDto } from './base-create-doc.dto';

/**
 * The DTO sent from the frontend to the backend to update a Doc.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateDocDto implements Partial<BaseCreateDocDto> {
  /**
   * @inheritdoc
   */
  title?: string;

  /**
   * @inheritdoc
   */
  upToDateDuration?: string | null;

  /**
   * @inheritdoc
   */
  docMarkdoc?: string;
}
