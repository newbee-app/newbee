import { DocNoOrg, TeamMember } from '../../interface';

/**
 * The DTO sent from the backend to the frontend for getting a doc.
 * If the user is a member of the doc's team, it will include team member information.
 * Org member information should already be present from getting the org.
 */
export class DocAndMemberDto {
  /**
   * @param doc The doc the user wants to view.
   * @param teamMember The user's relation to the doc's team, if any exist.
   */
  constructor(
    readonly doc: DocNoOrg,
    readonly teamMember: TeamMember | null = null,
  ) {}
}
