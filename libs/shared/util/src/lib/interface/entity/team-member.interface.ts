import { TeamRoleEnum } from '../../enum';
import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * The information associated with a team member.
 * Stored as an entity in the backend.
 */
export interface TeamMember extends CommonEntityFields {
  /**
   * The org member's role in the team.
   */
  role: TeamRoleEnum;
}
