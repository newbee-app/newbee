import { IsNotEmpty, Matches } from 'class-validator';
import {
  iso8601DurationRegex,
  nameIsNotEmpty,
  slugIsNotEmpty,
  upToDateDurationMatches,
} from '../../constant';
import type { CommonEntityFields, Organization } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to create a new organization.
 * Suitable for use in POST requests.
 */
export class CreateOrganizationDto
  implements Omit<Organization, keyof CommonEntityFields>
{
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: nameIsNotEmpty })
  readonly name: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  readonly slug: string;

  /**
   * @inheritdoc
   */
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  readonly upToDateDuration: string;

  constructor(name: string, slug: string, upToDateDuration: string) {
    this.name = name;
    this.slug = slug;
    this.upToDateDuration = upToDateDuration;
  }
}
