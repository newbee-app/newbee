import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  questionIsNotEmpty,
  teamIsNotEmpty,
  titleIsNotEmpty,
} from '../../constant';
import { UpdateQnaDto } from './update-qna.dto';

/**
 * The DTO sent from the frontend to the backend to update the question in a qna.
 * Suitable for use in PATCH requests.
 */
export class UpdateQuestionDto
  implements Pick<UpdateQnaDto, 'title' | 'questionMarkdoc' | 'team'>
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
  @IsNotEmpty({ message: questionIsNotEmpty })
  readonly questionMarkdoc?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: teamIsNotEmpty })
  readonly team?: string | null;

  constructor(obj: UpdateQuestionDto) {
    Object.assign(this, obj);
  }
}
