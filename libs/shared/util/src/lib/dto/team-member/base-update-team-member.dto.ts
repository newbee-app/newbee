import type { TeamRoleEnum } from '../../enum';
import type { BaseCreateTeamMemberDto } from './base-create-team-member.dto';

/**
 * The DTO sent from the frontend to the backend to update a team member.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateTeamMemberDto
  implements Pick<BaseCreateTeamMemberDto, 'role'>
{
  /**
   * @inheritdoc
   */
  role!: TeamRoleEnum;
}
