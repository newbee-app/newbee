import { BaseCreateQnaDto } from './base-create-qna.dto';

/**
 * The DTO sent from the frontend to the backend to update a QnA.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateQnaDto implements Partial<BaseCreateQnaDto> {
  /**
   * @inheritdoc
   */
  slug?: string;

  /**
   * @inheritdoc
   */
  questionMarkdown?: string;

  /**
   * @inheritdoc
   */
  answerMarkdown?: string;
}
