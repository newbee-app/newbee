import type { OrgRoleEnum } from '../../enum';
import type { OrgMember } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to update an org member.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateOrgMemberDto implements Pick<OrgMember, 'role'> {
  /**
   * @inheritdoc
   */
  role!: OrgRoleEnum;
}
