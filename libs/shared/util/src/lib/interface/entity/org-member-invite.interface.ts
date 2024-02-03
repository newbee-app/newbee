import { OrgRoleEnum } from '../../enum';
import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * The information associated with an org member invite.
 * Stored as an entity in the backend.
 */
export interface OrgMemberInvite extends CommonEntityFields {
  /**
   * The token representing the org member invite.
   * Represents a shortened version of the `id`.
   */
  token: string;

  /**
   * The role the user will have in the organization.
   */
  role: OrgRoleEnum;
}
