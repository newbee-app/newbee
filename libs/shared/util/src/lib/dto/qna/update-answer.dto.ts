import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import {
  answerIsNotEmpty,
  iso8601DurationRegex,
  maintainerIsNotEmpty,
  upToDateDurationMatches,
} from '../../constant';
import { UpdateQnaDto } from './update-qna.dto';

/**
 * The DTO sent from the frontend to the backend to update the answer in a QnA.
 * Suitable for use in PATCH requests.
 */
export class UpdateAnswerDto
  implements
    Pick<UpdateQnaDto, 'upToDateDuration' | 'answerMarkdoc' | 'maintainer'>
{
  /**
   * @inheritdoc
   */
  @IsOptional()
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  readonly upToDateDuration?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: answerIsNotEmpty })
  readonly answerMarkdoc?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: maintainerIsNotEmpty })
  readonly maintainer?: string;

  constructor(obj: UpdateAnswerDto) {
    Object.assign(this, obj);
  }
}
