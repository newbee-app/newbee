import { OrgRoleEnum } from '../../enum';
import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * The information associated with an org member.
 * Stored as an entity in the backend.
 */
export interface OrgMember extends CommonEntityFields {
  /**
   * The user's role in the organization.
   */
  role: OrgRoleEnum;

  /**
   * The user's unique slug within the organization.
   */
  slug: string;
}
