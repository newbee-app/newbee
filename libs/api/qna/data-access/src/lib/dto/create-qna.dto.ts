import { BaseCreateQnaDto } from '@newbee/shared/data-access';
import {
  answerIsNotEmpty,
  questionIsNotEmpty,
  titleIsNotEmpty,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to create a new QnA.
 * Suitable for use in POST requests.
 */
export class CreateQnaDto implements BaseCreateQnaDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: titleIsNotEmpty })
  title!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: questionIsNotEmpty })
  questionMarkdoc: string | null = null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: answerIsNotEmpty })
  answerMarkdoc: string | null = null;
}
