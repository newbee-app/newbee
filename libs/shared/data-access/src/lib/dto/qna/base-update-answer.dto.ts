import { Qna } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to update the answer in a QnA.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateAnswerDto implements Pick<Qna, 'answerMarkdown'> {
  /**
   * @inheritdoc
   */
  answerMarkdown!: string;
}
