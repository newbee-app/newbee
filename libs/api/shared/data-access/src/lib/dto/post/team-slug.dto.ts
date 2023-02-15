import { BaseTeamSlugDto } from '@newbee/shared/data-access';
import { slugIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * A verifiable DTO for sending a team slug value from the frontend to the backend.
 * Suitable for use in any request method.
 */
export class TeamSlugDto implements BaseTeamSlugDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: slugIsNotEmpty })
  team?: string;
}
