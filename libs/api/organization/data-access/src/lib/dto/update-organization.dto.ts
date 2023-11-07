import { BaseUpdateOrganizationDto } from '@newbee/shared/data-access';
import {
  iso8601DurationRegex,
  nameIsNotEmpty,
  slugIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

/**
 * The DTO sent from the frontend to the backend for updating an organization.
 * Suitable for use in PATCH requests.
 */
export class UpdateOrganizationDto implements BaseUpdateOrganizationDto {
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
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  upToDateDuration?: string;
}
