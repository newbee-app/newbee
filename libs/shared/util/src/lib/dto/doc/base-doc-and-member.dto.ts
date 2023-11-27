import { DocNoOrg, TeamMember } from '../../interface';

/**
 * The DTO sent from the backend to the frontend for getting a doc.
 * If the user is a member of the doc's team, it will include team member information.
 * Org member information should already be present from getting the org.
 */
export class BaseDocAndMemberDto {
  /**
   * The doc the user wants to view.
   */
  doc!: DocNoOrg;

  /**
   * The user's relation to the doc's team, if any exist.
   */
  teamMember: TeamMember | null = null;
}
