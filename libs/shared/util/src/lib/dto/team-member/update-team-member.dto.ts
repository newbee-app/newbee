import { IsEnum } from 'class-validator';
import { teamRoleIsEnum } from '../../constant';
import { TeamRoleEnum } from '../../enum';
import type { CreateTeamMemberDto } from './create-team-member.dto';

/**
 * The DTO sent from the frontend to the backend to update a team member.
 * Suitable for use in PATCH requests.
 */
export class UpdateTeamMemberDto implements Pick<CreateTeamMemberDto, 'role'> {
  /**
   * @inheritdoc
   */
  @IsEnum(TeamRoleEnum, { message: teamRoleIsEnum })
  readonly role: TeamRoleEnum;

  constructor(role: TeamRoleEnum) {
    this.role = role;
  }
}
