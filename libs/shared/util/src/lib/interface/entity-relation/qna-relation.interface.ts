import type { Organization, Qna, Team } from '../entity';
import type { OrgMemberUser } from './org-member-relation.interface';

/**
 * The Qna interface with relevant relationship information.
 */
export interface QnaRelation {
  /**
   * Information associated with the qna.
   */
  qna: Qna;

  /**
   * The organization the qna belongs to.
   */
  organization: Organization;

  /**
   * The team the qna belongs to, if any.
   */
  team: Team | null;

  /**
   * The creator of the qna.
   */
  creator: OrgMemberUser | null;

  /**
   * The maintainer of the qna.
   */
  maintainer: OrgMemberUser | null;
}

/**
 * QnaRelation with org information removed.
 */
export type QnaNoOrg = Omit<QnaRelation, 'organization'>;

/**
 * QnaRelation with org and team information removed.
 */
export type QnaNoOrgTeam = Omit<QnaRelation, 'organization' | 'team'>;
