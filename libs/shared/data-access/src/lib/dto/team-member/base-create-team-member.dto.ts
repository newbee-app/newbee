import type { TeamMember, TeamRoleEnum } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new team member.
 * Suitable for use in POST requests.
 */
export class BaseCreateTeamMemberDto implements TeamMember {
  /**
   * @inheritdoc
   */
  role!: TeamRoleEnum;

  /**
   * The slug of the org member to turn into a team member.
   */
  orgMemberSlug!: string;
}
