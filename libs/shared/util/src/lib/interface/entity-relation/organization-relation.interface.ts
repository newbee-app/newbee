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
   * A selection of docs that belong to the team, as well as a count of the total number of docs in the org.
   */
  docs: Sample<DocQueryResult>;

  /**
   * A selection of QnAs that belong to the team, as well as a count of the total number of QnAs in the org.
   */
  qnas: Sample<QnaQueryResult>;

  /**
   * A selection of org members that belong to the org, as well as a count of the total number of people in the org.
   */
  orgMembers: Sample<OrgMemberUser>;
}

/**
 * OrganizationRelation with org and teams information.
 */
export type OrgTeams = Pick<OrganizationRelation, 'organization' | 'teams'>;
