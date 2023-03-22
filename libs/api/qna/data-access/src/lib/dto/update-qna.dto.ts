import { BaseUpdateQnaDto } from '@newbee/shared/data-access';
import {
  answerIsNotEmpty,
  questionIsNotEmpty,
  titleIsNotEmpty,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to update a QnA.
 * Suitable for use in PATCH requests.
 */
export class UpdateQnaDto implements BaseUpdateQnaDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: titleIsNotEmpty })
  title?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: questionIsNotEmpty })
  questionMarkdoc?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: answerIsNotEmpty })
  answerMarkdoc?: string;
}
