import type { TeamRoleEnum } from '../../enum';
import type { CommonEntityFields, TeamMember } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to create a new team member.
 * Suitable for use in POST requests.
 */
export class BaseCreateTeamMemberDto
  implements Omit<TeamMember, keyof CommonEntityFields>
{
  /**
   * @inheritdoc
   */
  role!: TeamRoleEnum;

  /**
   * The slug of the org member to turn into a team member.
   */
  orgMemberSlug!: string;
}
