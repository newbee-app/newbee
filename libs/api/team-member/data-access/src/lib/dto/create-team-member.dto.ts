import { BaseCreateTeamMemberDto } from '@newbee/shared/data-access';
import {
  slugIsNotEmpty,
  TeamRoleEnum,
  teamRoleIsEnum,
} from '@newbee/shared/util';
import { IsEnum, IsNotEmpty } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to create a new team member.
 * Suitable for use in POST requests.
 */
export class CreateTeamMemberDto implements BaseCreateTeamMemberDto {
  /**
   * @inheritdoc
   */
  @IsEnum(TeamRoleEnum, { message: teamRoleIsEnum })
  role!: TeamRoleEnum;

  /**
   * @inheritdoc
   */
  @IsNotEmpty({ message: slugIsNotEmpty })
  orgMemberSlug!: string;
}
