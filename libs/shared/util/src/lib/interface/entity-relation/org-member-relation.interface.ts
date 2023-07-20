import { Sample } from '../../type';
import type { Doc, Organization, OrgMember, Qna, User } from '../entity';
import type { TeamMemberAndTeam } from './team-member-relation.interface';

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
  teams: Sample<TeamMemberAndTeam>;

  /**
   * The docs the org member created.
   */
  createdDocs: Sample<Doc>;

  /**
   * The docs the org member maintains.
   */
  maintainedDocs: Sample<Doc>;

  /**
   * The qnas the org member created.
   */
  createdQnas: Sample<Qna>;

  /**
   * The qnas the org member maintains.
   */
  maintainedQnas: Sample<Qna>;
}

/**
 * OrgMemberRelation without user information.
 */
export type OrgMemberNoUser = Omit<OrgMemberRelation, 'user'>;

/**
 * OrgMemberRelation without org information.
 */
export type OrgMemberNoOrg = Omit<OrgMemberRelation, 'organization'>;

/**
 * OrgMemberRelation with only user information.
 */
export type OrgMemberUser = Pick<OrgMemberRelation, 'orgMember' | 'user'>;
