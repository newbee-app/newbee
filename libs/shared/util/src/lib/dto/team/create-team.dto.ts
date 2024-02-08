import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import {
  iso8601DurationRegex,
  nameIsNotEmpty,
  slugIsNotEmpty,
  upToDateDurationMatches,
} from '../../constant';
import type { CommonEntityFields, Team } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to create a new team.
 * Suitable for use in POST requests.
 */
export class CreateTeamDto implements Omit<Team, keyof CommonEntityFields> {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: nameIsNotEmpty })
  readonly name!: string;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  readonly slug!: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @Matches(iso8601DurationRegex, { message: upToDateDurationMatches })
  readonly upToDateDuration: string | null = null;

  constructor(name: string, slug: string, upToDateDuration: string | null) {
    this.name = name;
    this.slug = slug;
    this.upToDateDuration = upToDateDuration;
  }
}
