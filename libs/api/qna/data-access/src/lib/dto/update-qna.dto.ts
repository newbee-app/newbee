import { BaseUpdateQnaDto } from '@newbee/shared/data-access';
import {
  answerIsNotEmpty,
  questionIsNotEmpty,
  slugIsNotEmpty,
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
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: questionIsNotEmpty })
  questionMarkdown?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: answerIsNotEmpty })
  answerMarkdown?: string | null;
}
