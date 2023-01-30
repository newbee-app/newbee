import { Qna } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new QnA.
 * Suitable for use in POST requests.
 */
export class BaseCreateQnaDto
  implements Pick<Qna, 'slug' | 'questionMarkdown' | 'answerMarkdown'>
{
  /**
   * @inheritdoc
   */
  slug!: string;

  /**
   * @inheritdoc
   */
  questionMarkdown!: string;

  /**
   * @inheritdoc
   */
  answerMarkdown: string | null = null;
}
