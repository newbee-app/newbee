import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  answerIsNotEmpty,
  questionIsNotEmpty,
  teamIsNotEmpty,
  titleIsNotEmpty,
} from '../../constant';
import { Qna } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to create a new qna.
 * Suitable for use in POST requests.
 */
export class CreateQnaDto
  implements Pick<Qna, 'title' | 'questionMarkdoc' | 'answerMarkdoc'>
{
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: titleIsNotEmpty })
  readonly title: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: questionIsNotEmpty })
  readonly questionMarkdoc: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: answerIsNotEmpty })
  readonly answerMarkdoc: string | null;

  /**
   * The slug of the team to ask the question to, if any.
   */
  @IsOptional()
  @IsNotEmpty({ message: teamIsNotEmpty })
  readonly team: string | null;

  constructor(
    title: string,
    questionMarkdoc: string | null,
    answerMarkdoc: string | null,
    team: string | null,
  ) {
    this.title = title;
    this.questionMarkdoc = questionMarkdoc;
    this.answerMarkdoc = answerMarkdoc;
    this.team = team;
  }
}
