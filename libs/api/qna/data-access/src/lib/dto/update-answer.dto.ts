import { BaseUpdateAnswerDto } from '@newbee/shared/data-access';
import { answerIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to update the answer in a QnA.
 * Suitable for use in PATCH requests.
 */
export class UpdateAnswerDto implements BaseUpdateAnswerDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: answerIsNotEmpty })
  answerMarkdoc!: string;
}
