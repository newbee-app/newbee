import { IsEnum } from 'class-validator';
import { orgRoleIsEnum } from '../../constant';
import { OrgRoleEnum } from '../../enum';
import type { OrgMember } from '../../interface';

/**
 * The DTO sent from the frontend to the backend to update an org member.
 * Suitable for use in PATCH requests.
 */
export class UpdateOrgMemberDto implements Pick<OrgMember, 'role'> {
  /**
   * @inheritdoc
   */
  @IsEnum(OrgRoleEnum, { message: orgRoleIsEnum })
  readonly role!: OrgRoleEnum;

  constructor(role: OrgRoleEnum) {
    this.role = role;
  }
}
