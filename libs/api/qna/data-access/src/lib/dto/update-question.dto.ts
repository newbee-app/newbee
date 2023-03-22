import { BaseUpdateQuestionDto } from '@newbee/shared/data-access';
import { questionIsNotEmpty, titleIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to update the question in a QnA.
 * Suitable for use in PATCH requests.
 */
export class UpdateQuestionDto implements BaseUpdateQuestionDto {
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
}
