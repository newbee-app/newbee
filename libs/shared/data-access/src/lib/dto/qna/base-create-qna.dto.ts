import { Qna } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new QnA.
 * Suitable for use in POST requests.
 */
export class BaseCreateQnaDto
  implements Pick<Qna, 'title' | 'questionMarkdoc' | 'answerMarkdoc'>
{
  /**
   * @inheritdoc
   */
  title!: string;

  /**
   * @inheritdoc
   */
  questionMarkdoc: string | null = null;

  /**
   * @inheritdoc
   */
  answerMarkdoc: string | null = null;
}
