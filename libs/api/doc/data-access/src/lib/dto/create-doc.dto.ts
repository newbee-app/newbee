import { BaseCreateDocDto } from '@newbee/shared/data-access';
import {
  docIsNotEmpty,
  iso8601DurationRegex,
  titleIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backed to create a new doc.
 * Suitable for use in POST requests.
 */
export class CreateDocDto implements BaseCreateDocDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: titleIsNotEmpty })
  title!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  upToDateDuration: string | null = null;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: docIsNotEmpty })
  docMarkdoc!: string;
}
