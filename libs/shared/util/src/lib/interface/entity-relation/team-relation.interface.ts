import type { Sample } from '../../type';
import type { Organization, Team } from '../entity';
import { DocMembers } from './doc-relation.interface';
import { QnaMembers } from './qna-relation.interface';
import type { TeamMemberUserOrgMember } from './team-member-relation.interface';

/**
 * The Team interface with relevanbt relationship information.
 */
export interface TeamRelation {
  /**
   * The name and slug of the team.
   */
  team: Team;

  /**
   * The name and slug of the organization the team belongs to.
   */
  organization: Organization;

  /**
   * A selection of docs that belong to the team, as well as a count of the total number of docs in the team.
   */
  docs: Sample<DocMembers>;

  /**
   * A selection of qnas that belong to the team, as well as a count of the total number of qnas in the team.
   */
  qnas: Sample<QnaMembers>;

  /**
   * A selection of team members that belong to the team, as well as a count of the total number of people in the team.
   * Team member information includes user-related information, the role they hold in the team, the role they hold in the org, and their org member slug.
   */
  teamMembers: Sample<TeamMemberUserOrgMember>;
}

/**
 * TeamRelation without org information.
 */
export type TeamNoOrg = Omit<TeamRelation, 'organization'>;
