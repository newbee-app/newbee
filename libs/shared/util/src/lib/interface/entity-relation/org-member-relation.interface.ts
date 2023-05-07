import type { Doc, Organization, OrgMember, Qna, User } from '../entity';
import type { TeamMemberRelation } from './team-member-relation.interface';

/**
 * The OrgMember interface with relevant relationship information.
 */
export interface OrgMemberRelation {
  /**
   * The role and slug of the org member.
   */
  orgMember: OrgMember;

  /**
   * The name and slug of the organization the org member is attached to.
   */
  organization: Organization;

  /**
   * The email, name, display name, and phone number of the user the org member is attached to.
   */
  user: User;

  /**
   * The teams the org member is a part of, and the role they hold in each team.
   */
  teams: Omit<TeamMemberRelation, 'orgMember' | 'organization' | 'user'>[];

  /**
   * The docs the org member created.
   */
  createdDocs: Doc[];

  /**
   * The docs the org member maintains.
   */
  maintainedDocs: Doc[];

  /**
   * The qnas the org member created.
   */
  createdQnas: Qna[];

  /**
   * The qnas the org member maintains.
   */
  maintainedQnas: Qna[];
}
