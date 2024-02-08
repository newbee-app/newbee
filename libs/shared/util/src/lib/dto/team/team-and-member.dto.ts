import type { TeamMember, TeamNoOrg } from '../../interface';

/**
 * The DTO sent from the backend to the frontend for getting a team.
 * If the user is a member of the team, it will include team member information.
 */
export class TeamAndMemberDto {
  /**
   * @param team The team the user wants to view.
   * @param teamMember The user's relation to the team.
   */
  constructor(
    readonly team: TeamNoOrg,
    readonly teamMember: TeamMember | null,
  ) {}
}
