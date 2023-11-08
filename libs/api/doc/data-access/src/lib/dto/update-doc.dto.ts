import {
  BaseUpdateDocDto,
  docIsNotEmpty,
  iso8601DurationRegex,
  titleIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to update a Doc.
 * Suitable for use in PATCH requests.
 */
export class UpdateDocDto implements BaseUpdateDocDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: titleIsNotEmpty })
  title?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  upToDateDuration?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: docIsNotEmpty })
  docMarkdoc?: string;
}
