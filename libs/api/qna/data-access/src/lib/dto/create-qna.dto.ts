import { BaseCreateQnaDto } from '@newbee/shared/data-access';
import {
  answerIsNotEmpty,
  questionIsNotEmpty,
  slugIsNotEmpty,
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
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug!: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: questionIsNotEmpty })
  questionMarkdown!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: answerIsNotEmpty })
  answerMarkdown: string | null = null;
}
