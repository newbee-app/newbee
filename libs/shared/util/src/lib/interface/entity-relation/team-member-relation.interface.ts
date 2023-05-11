import type {
  Organization,
  OrgMember,
  Team,
  TeamMember,
  User,
} from '../entity';

/**
 * The TeamMember interface with relevant relationship information.
 */
export interface TeamMemberRelation {
  /**
   * The team member's role.
   */
  teamMember: TeamMember;

  /**
   * The name and slug of the team the team member is attached to.
   */
  team: Team;

  /**
   * The role and slug of the org member the team member is attached to.
   */
  orgMember: OrgMember;

  /**
   * The name and slug of the organization the team member is attached to.
   */
  organization: Organization;

  /**
   * The email, name, display name, and phone number of the user the team member is attached to.
   */
  user: User;
}

/**
 * TeamMemberRelation with only team-related information.
 */
export type TeamMemberAndTeam = Pick<TeamMemberRelation, 'teamMember' | 'team'>;
