import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import {
  iso8601DurationRegex,
  nameIsNotEmpty,
  slugIsNotEmpty,
  upToDateDurationMatches,
} from '../../constant';
import { CreateOrganizationDto } from './create-organization.dto';

/**
 * The DTO sent from the frontend to the backend for updating an organization's value.
 * Suitable for use in PATCH requests.
 */
export class UpdateOrganizationDto implements Partial<CreateOrganizationDto> {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: nameIsNotEmpty })
  readonly name?: string;

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
  readonly upToDateDuration?: string;

  constructor(obj: UpdateOrganizationDto) {
    Object.assign(this, obj);
  }
}
