import { Qna } from '../../interface';
import { BaseCreateQnaDto } from './base-create-qna.dto';

/**
 * The DTO sent from the frontend to the backend to update a QnA.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateQnaDto
  implements Partial<BaseCreateQnaDto>, Partial<Pick<Qna, 'upToDateDuration'>>
{
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
  questionMarkdoc?: string | null;

  /**
   * @inheritdoc
   */
  answerMarkdoc?: string;

  /**
   * @inheritdoc
   */
  team?: string | null;

  /**
   * The slug of the org member to make the qna's maintainer.
   */
  maintainer?: string;
}
