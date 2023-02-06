import { BaseTeamNameDto } from '@newbee/shared/data-access';
import { teamNameIsNotEmpty } from '@newbee/shared/util';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * A verifiable DTO for sending a team name value from the frontend to the backend.
 * Suitable for use in any request method.
 */
export class TeamNameDto implements BaseTeamNameDto {
  /**
   * @inheritdoc
   */
  @IsOptional()
  @IsNotEmpty({ message: teamNameIsNotEmpty })
  teamName?: string;
}
