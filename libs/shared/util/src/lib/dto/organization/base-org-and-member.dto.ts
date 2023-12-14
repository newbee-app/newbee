import type { OrgMemberNoUserOrg, OrgTeamsMembers } from '../../interface';

/**
 * The DTO sent from the backend to the frontend for getting an org.
 * If the user is a member of the org, it will include org member information.
 */
export class BaseOrgAndMemberDto {
  /**
   * The organization the user wants to view.
   */
  organization!: OrgTeamsMembers;

  /**
   * The user's relation to the org.
   */
  orgMember!: OrgMemberNoUserOrg;
}
