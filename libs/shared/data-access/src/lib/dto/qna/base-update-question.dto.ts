import { BaseUpdateQnaDto } from './base-update-qna.dto';

/**
 * The DTO sent from the frontend to the backend to update the question in a QnA.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateQuestionDto
  implements Pick<BaseUpdateQnaDto, 'title' | 'questionMarkdoc'>
{
  /**
   * @inheritdoc
   */
  title?: string;

  /**
   * @inheritdoc
   */
  questionMarkdoc?: string | null;
}
