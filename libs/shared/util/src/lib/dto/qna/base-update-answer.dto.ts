import { BaseUpdateQnaDto } from './base-update-qna.dto';

/**
 * The DTO sent from the frontend to the backend to update the answer in a QnA.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateAnswerDto
  implements
    Pick<BaseUpdateQnaDto, 'upToDateDuration' | 'answerMarkdoc' | 'maintainer'>
{
  /**
   * @inheritdoc
   */
  upToDateDuration?: string | null;

  /**
   * @inheritdoc
   */
  answerMarkdoc?: string;

  /**
   * @inheritdoc
   */
  maintainer?: string;
}
