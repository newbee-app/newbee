import { Qna } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to update the question in a QnA.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateQuestionDto
  implements Partial<Pick<Qna, 'title' | 'questionMarkdoc'>>
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
