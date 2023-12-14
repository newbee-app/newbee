import { iso8601DurationRegex } from '@newbee/api/shared/util';
import {
  BaseCreateOrganizationDto,
  nameIsNotEmpty,
  slugIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { IsNotEmpty, Matches } from 'class-validator';

/**
 * A verifiable DTO sent from the frontend to the backend to create a new organization.
 * Suitable for use in POST requests.
 */
export class CreateOrganizationDto implements BaseCreateOrganizationDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: nameIsNotEmpty })
  name!: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  slug!: string;

  /**
   * @inheritdoc
   */
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  upToDateDuration!: string;
}
