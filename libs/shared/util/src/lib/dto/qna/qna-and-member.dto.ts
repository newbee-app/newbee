import { QnaNoOrg, TeamMember } from '../../interface';

/**
 * The DTO sent from the backend to the frontend for getting a qna.
 * If the user is a member of the qna's team, it will include team member information.
 * Org member information should already be present from getting the org.
 */
export class QnaAndMemberDto {
  /**
   * @param qna The qna the user wants to view.
   * @param teamMember The user's relation to the qna's team, if any exist.
   */
  constructor(
    readonly qna: QnaNoOrg,
    readonly teamMember: TeamMember | null,
  ) {}
}
