import type { DocSearchResult, QnaSearchResult } from '../../type';
import type { OrgMember, Organization, PublicUser } from '../entity';
import { PaginatedResults } from '../util';
import type { TeamMemberAndTeam } from './team-member-relation.interface';

/**
 * The OrgMember interface with relevant relationship information.
 */
export interface OrgMemberRelation {
  /**
   * The role and slug of the org member.
   */
  readonly orgMember: OrgMember;

  /**
   * The name and slug of the organization the org member is attached to.
   */
  readonly organization: Organization;

  /**
   * The email, name, display name, and phone number of the user the org member is attached to.
   */
  readonly user: PublicUser;

  /**
   * The teams the org member is a part of, and the role they hold in each team.
   */
  readonly teams: TeamMemberAndTeam[];

  /**
   * The docs the org member created.
   */
  readonly createdDocs: PaginatedResults<DocSearchResult>;

  /**
   * The docs the org member maintains.
   */
  readonly maintainedDocs: PaginatedResults<DocSearchResult>;

  /**
   * The qnas the org member created.
   */
  readonly createdQnas: PaginatedResults<QnaSearchResult>;

  /**
   * The qnas the org member maintains.
   */
  readonly maintainedQnas: PaginatedResults<QnaSearchResult>;
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
