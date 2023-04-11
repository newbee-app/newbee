import type { Team, TeamMember, TeamRoleEnum } from '@newbee/shared/util';

/**
 * The DTO sent from the backend to the frontend to show information about a team member.
 */
export class BaseTeamMemberDto implements TeamMember, Team {
  /**
   * @inheritdoc
   */
  name!: string;

  /**
   * @inheritdoc
   */
  slug!: string;

  /**
   * @inheritdoc
   */
  role!: TeamRoleEnum;
}
