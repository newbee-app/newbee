import { BaseUpdateTeamDto } from '@newbee/shared/data-access';
import { displayNameIsNotEmpty, nameIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend for updating a team's value.
 * Suitable for use in PATCH requests.
 */
export class UpdateTeamDto implements BaseUpdateTeamDto {
  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: nameIsNotEmpty })
  name?: string;

  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: displayNameIsNotEmpty })
  displayName?: string | null;
}
