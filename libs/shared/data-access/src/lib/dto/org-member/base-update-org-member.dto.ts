import type { OrgMember, OrgRoleEnum } from '@newbee/shared/util';

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
