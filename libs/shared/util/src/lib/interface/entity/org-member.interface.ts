import { OrgRoleEnum } from '../../enum';

/**
 * The information associated with an org member.
 * Stored as an entity in the backend.
 */
export interface OrgMember {
  /**
   * The user's role in the organization.
   */
  role: OrgRoleEnum;

  /**
   * The user's unique slug within the organization.
   */
  slug: string;
}
