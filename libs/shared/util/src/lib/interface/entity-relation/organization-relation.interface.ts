import { DocQueryResult, QnaQueryResult, Sample } from '../../type';
import type { Organization } from '../entity/organization.interface';
import type { Team } from '../entity/team.interface';
import { OrgMemberUser } from './org-member-relation.interface';

/**
 * The Organization interface with relevant relationship information.
 */
export interface OrganizationRelation {
  /**
   * The name and slug of the organization.
   */
  organization: Organization;

  /**
   * The names and slugs of all of the teams of the organization.
   */
  teams: Team[];

  /**
   * All of the org members that belong to the org.
   */
  members: OrgMemberUser[];

  /**
   * A selection of docs that belong to the team, as well as a count of the total number of docs in the org.
   */
  docs: Sample<DocQueryResult>;

  /**
   * A selection of QnAs that belong to the team, as well as a count of the total number of QnAs in the org.
   */
  qnas: Sample<QnaQueryResult>;
}

/**
 * OrganizationRelation with org, teams, and org members information.
 */
export type OrgTeamsMembers = Pick<
  OrganizationRelation,
  'organization' | 'teams' | 'members'
>;
