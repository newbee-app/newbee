import { BaseUpdateTeamMemberDto } from '@newbee/shared/data-access';
import { TeamRoleEnum, teamRoleIsEnum } from '@newbee/shared/util';
import { IsEnum } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to update a team member.
 * Suitable for use in PATCH requests.
 */
export class UpdateTeamMemberDto implements BaseUpdateTeamMemberDto {
  /**
   * @inheritdoc
   */
  @IsEnum(TeamRoleEnum, { message: teamRoleIsEnum })
  role!: TeamRoleEnum;
}
