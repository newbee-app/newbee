import { BaseCreateTeamDto } from '@newbee/shared/data-access';
import { nameIsNotEmpty, slugIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

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
}
