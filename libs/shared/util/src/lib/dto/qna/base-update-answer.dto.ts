import { BaseUpdateQnaDto } from './base-update-qna.dto';

/**
 * The DTO sent from the frontend to the backend to update the answer in a QnA.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateAnswerDto
  implements Pick<BaseUpdateQnaDto, 'answerMarkdoc' | 'upToDateDuration'>
{
  /**
   * @inheritdoc
   */
  answerMarkdoc?: string;

  /**
   * @inheritdoc
   */
  upToDateDuration?: string | null = null;
}
