import {
  BaseUpdateTeamDto,
  nameIsNotEmpty,
  slugIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend for updating a team's value.
 * Suitable for use in PATCH requests.
 */
export class UpdateTeamDto implements BaseUpdateTeamDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: nameIsNotEmpty })
  name?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: upToDateDurationMatches })
  upToDateDuration?: string | null;
}
