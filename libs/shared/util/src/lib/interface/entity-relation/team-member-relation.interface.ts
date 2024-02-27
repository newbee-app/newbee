import type {
  Organization,
  OrgMember,
  PublicUser,
  Team,
  TeamMember,
} from '../entity';

/**
 * The TeamMember interface with relevant relationship information.
 */
export interface TeamMemberRelation {
  /**
   * The team member's role.
   */
  readonly teamMember: TeamMember;

  /**
   * The name and slug of the team the team member is attached to.
   */
  readonly team: Team;

  /**
   * The role and slug of the org member the team member is attached to.
   */
  readonly orgMember: OrgMember;

  /**
   * The name and slug of the organization the team member is attached to.
   */
  readonly organization: Organization;

  /**
   * The email, name, display name, and phone number of the user the team member is attached to.
   */
  readonly user: PublicUser;
}

/**
 * TeamMemberRelation with only team-related information.
 */
export type TeamMemberAndTeam = Pick<TeamMemberRelation, 'teamMember' | 'team'>;

/**
 * TeamMemberRelation with only user and org member-related information.
 */
export type TeamMemberUserOrgMember = Pick<
  TeamMemberRelation,
  'teamMember' | 'user' | 'orgMember'
>;
