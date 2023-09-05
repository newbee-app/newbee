import type { Doc, Organization, Team } from '../entity';
import type { OrgMemberUser } from './org-member-relation.interface';

/**
 * The Doc interface with relevant relationship information.
 */
export interface DocRelation {
  /**
   * Information associated with the doc.
   */
  doc: Doc;

  /**
   * The organization the doc belongs to.
   */
  organization: Organization;

  /**
   * The team the doc belongs to, if any.
   */
  team: Team | null;

  /**
   * The creator of the doc.
   */
  creator: OrgMemberUser | null;

  /**
   * The maintainer of the doc.
   */
  maintainer: OrgMemberUser | null;
}

/**
 * DocRelation with org information removed.
 */
export type DocNoOrg = Omit<DocRelation, 'organization'>;
