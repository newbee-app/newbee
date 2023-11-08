import {
  BaseUpdateAnswerDto,
  answerIsNotEmpty,
  iso8601DurationRegex,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to update the answer in a QnA.
 * Suitable for use in PATCH requests.
 */
export class UpdateAnswerDto implements BaseUpdateAnswerDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: answerIsNotEmpty })
  answerMarkdoc?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  upToDateDuration?: string | null;
}
