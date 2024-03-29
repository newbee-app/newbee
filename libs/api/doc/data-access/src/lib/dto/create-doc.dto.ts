import { iso8601DurationRegex } from '@newbee/api/shared/util';
import {
  BaseCreateDocDto,
  docIsNotEmpty,
  teamIsNotEmpty,
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

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: teamIsNotEmpty })
  team: string | null = null;
}
