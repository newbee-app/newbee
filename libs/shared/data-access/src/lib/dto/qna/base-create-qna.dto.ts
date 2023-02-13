import { Qna } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new QnA.
 * Suitable for use in POST requests.
 */
export class BaseCreateQnaDto
  implements Pick<Qna, 'title' | 'questionMarkdown' | 'answerMarkdown'>
{
  /**
   * @inheritdoc
   */
  title!: string;

  /**
   * @inheritdoc
   */
  questionMarkdown: string | null = null;

  /**
   * @inheritdoc
   */
  answerMarkdown: string | null = null;
}
