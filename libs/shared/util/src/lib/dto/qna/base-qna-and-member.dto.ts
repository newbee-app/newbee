import { QnaNoOrg, TeamMember } from '../../interface';

/**
 * The DTO sent from the backend to the frontend for getting a qna.
 * If the user is a member of the qna's team, it will include team member information.
 * Org member information should already be present from getting the org.
 */
export class BaseQnaAndMemberDto {
  /**
   * The qna the user wants to view.
   */
  qna!: QnaNoOrg;

  /**
   * The user's relation to the qna's team, if any exist.
   */
  teamMember: TeamMember | null = null;
}
