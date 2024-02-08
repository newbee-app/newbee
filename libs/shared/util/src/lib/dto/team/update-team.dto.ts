import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  nameIsNotEmpty,
  slugIsNotEmpty,
  upToDateDurationMatches,
} from '../../constant';
import { CreateTeamDto } from './create-team.dto';

/**
 * The DTO sent from the frontend to the backend for updating a team's value.
 * Suitable for use in PATCH requests.
 */
export class UpdateTeamDto implements Partial<CreateTeamDto> {
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
  readonly slug?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: upToDateDurationMatches })
  readonly upToDateDuration?: string | null;

  constructor(obj: UpdateTeamDto) {
    Object.assign(this, obj);
  }
}
