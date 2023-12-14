import { iso8601DurationRegex } from '@newbee/api/shared/util';
import {
  BaseCreateTeamDto,
  nameIsNotEmpty,
  slugIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to create a new team.
 * Suitable for use in POST requests.
 */
export class CreateTeamDto implements BaseCreateTeamDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: nameIsNotEmpty })
  name!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  upToDateDuration: string | null = null;
}
