import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import {
  docIsNotEmpty,
  iso8601DurationRegex,
  teamIsNotEmpty,
  titleIsNotEmpty,
  upToDateDurationMatches,
} from '../../constant';
import { Doc } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to create a new doc.
 * Suitable for use in POST requests.
 */
export class CreateDocDto
  implements Pick<Doc, 'title' | 'upToDateDuration' | 'docMarkdoc'>
{
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: titleIsNotEmpty })
  readonly title!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  readonly upToDateDuration: string | null = null;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: docIsNotEmpty })
  readonly docMarkdoc!: string;

  /**
   * The slug of the team to put the doc in, if any.
   */
  @IsOptional()
  @IsNotEmpty({ message: teamIsNotEmpty })
  readonly team: string | null = null;

  constructor(
    title: string,
    upToDateDuration: string | null,
    docMarkdoc: string,
    team: string | null,
  ) {
    this.title = title;
    this.upToDateDuration = upToDateDuration;
    this.docMarkdoc = docMarkdoc;
    this.team = team;
  }
}
