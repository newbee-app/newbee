import type { DocSearchResult, QnaSearchResult } from '../../type';
import type { Organization, Team } from '../entity';
import { PaginatedResults } from '../util';
import type { TeamMemberUserOrgMember } from './team-member-relation.interface';

/**
 * The Team interface with relevant relationship information.
 */
export interface TeamRelation {
  /**
   * The name and slug of the team.
   */
  readonly team: Team;

  /**
   * The name and slug of the organization the team belongs to.
   */
  readonly organization: Organization;

  /**
   * A selection of docs that belong to the team, as well as a count of the total number of docs in the team.
   */
  readonly docs: PaginatedResults<DocSearchResult>;

  /**
   * A selection of qnas that belong to the team, as well as a count of the total number of qnas in the team.
   */
  readonly qnas: PaginatedResults<QnaSearchResult>;

  /**
   * All of the team members that belong to the team.
   * Team member information includes user-related information, the role they hold in the team, the role they hold in the org, and their org member slug.
   */
  readonly teamMembers: TeamMemberUserOrgMember[];
}

/**
 * TeamRelation without org information.
 */
export type TeamNoOrg = Omit<TeamRelation, 'organization'>;
