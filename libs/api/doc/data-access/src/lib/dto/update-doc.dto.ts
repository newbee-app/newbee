import { iso8601DurationRegex } from '@newbee/api/shared/util';
import {
  BaseUpdateDocDto,
  docIsNotEmpty,
  maintainerIsNotEmpty,
  teamIsNotEmpty,
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

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: teamIsNotEmpty })
  team?: string | null;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: maintainerIsNotEmpty })
  maintainer?: string;
}
