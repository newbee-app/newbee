import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import {
  answerIsNotEmpty,
  iso8601DurationRegex,
  maintainerIsNotEmpty,
  questionIsNotEmpty,
  teamIsNotEmpty,
  titleIsNotEmpty,
  upToDateDurationMatches,
} from '../../constant';
import { Qna } from '../../interface';
import { CreateQnaDto } from './create-qna.dto';

/**
 * The DTO sent from the frontend to the backend to update a qna.
 * Suitable for use in PATCH requests.
 */
export class UpdateQnaDto
  implements Partial<CreateQnaDto>, Partial<Pick<Qna, 'upToDateDuration'>>
{
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: titleIsNotEmpty })
  readonly title?: string;

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
  @IsNotEmpty({ message: questionIsNotEmpty })
  readonly questionMarkdoc?: string | null;

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
  @IsNotEmpty({ message: teamIsNotEmpty })
  readonly team?: string | null;

  /**
   * The slug of the org member to make the qna's maintainer.
   */
  @IsOptional()
  @IsNotEmpty({ message: maintainerIsNotEmpty })
  readonly maintainer?: string;

  constructor(obj: UpdateQnaDto) {
    Object.assign(this, obj);
  }
}
