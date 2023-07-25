import type { TeamMember, TeamNoOrg } from '@newbee/shared/util';

/**
 * The DTO sent from the backend to the frontend for getting a team.
 * If the user is a member of the team, it will include team member information.
 */
export class BaseTeamAndMemberDto {
  /**
   * The team the user wants to view.
   */
  team!: TeamNoOrg;

  /**
   * The user's relation to the team.
   */
  teamMember!: TeamMember | null;
}
