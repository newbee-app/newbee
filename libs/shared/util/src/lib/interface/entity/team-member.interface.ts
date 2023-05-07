import { TeamRoleEnum } from '../../enum';

/**
 * The information associated with a team member.
 * Stored as an entity in the backend.
 */
export interface TeamMember {
  /**
   * The org member's role in the team.
   */
  role: TeamRoleEnum;
}
