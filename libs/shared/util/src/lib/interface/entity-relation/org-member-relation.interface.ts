import type { DocQueryResult, QnaQueryResult } from '../../type';
import type { OrgMember, Organization, User } from '../entity';
import { PaginatedResults } from '../util';
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
  teams: TeamMemberAndTeam[];

  /**
   * The docs the org member created.
   */
  createdDocs: PaginatedResults<DocQueryResult>;

  /**
   * The docs the org member maintains.
   */
  maintainedDocs: PaginatedResults<DocQueryResult>;

  /**
   * The qnas the org member created.
   */
  createdQnas: PaginatedResults<QnaQueryResult>;

  /**
   * The qnas the org member maintains.
   */
  maintainedQnas: PaginatedResults<QnaQueryResult>;
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
 * OrgMemberRelation without user or org information.
 */
export type OrgMemberNoUserOrg = Omit<
  OrgMemberRelation,
  'user' | 'organization'
>;

/**
 * OrgMemberRelation with only user information.
 */
export type OrgMemberUser = Pick<OrgMemberRelation, 'orgMember' | 'user'>;
