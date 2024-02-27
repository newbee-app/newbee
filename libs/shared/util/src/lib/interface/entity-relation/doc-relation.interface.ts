import type { Doc, Organization, Team } from '../entity';
import type { OrgMemberUser } from './org-member-relation.interface';

/**
 * The Doc interface with relevant relationship information.
 */
export interface DocRelation {
  /**
   * Information associated with the doc.
   */
  readonly doc: Doc;

  /**
   * The organization the doc belongs to.
   */
  readonly organization: Organization;

  /**
   * The team the doc belongs to, if any.
   */
  readonly team: Team | null;

  /**
   * The creator of the doc.
   */
  readonly creator: OrgMemberUser | null;

  /**
   * The maintainer of the doc.
   */
  readonly maintainer: OrgMemberUser | null;
}

/**
 * DocRelation with org information removed.
 */
export type DocNoOrg = Omit<DocRelation, 'organization'>;

/**
 * DocRelation with org and team information removed.
 */
export type DocNoOrgTeam = Omit<DocRelation, 'organization' | 'team'>;
