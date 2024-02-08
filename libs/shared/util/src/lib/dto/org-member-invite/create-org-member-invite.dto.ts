import { IsEnum } from 'class-validator';
import { orgRoleIsEnum } from '../../constant';
import { OrgRoleEnum } from '../../enum';
import { EmailDto } from '../auth';

/**
 * The DTO sent from the frontend to the backend to create a new OrgMemberInviteEntity.
 * Suitable for use in POST requests.
 */
export class CreateOrgMemberInviteDto extends EmailDto {
  /**
   * The role the user would have in the organization.
   */
  @IsEnum(OrgRoleEnum, { message: orgRoleIsEnum })
  readonly role: OrgRoleEnum;

  constructor(email: string, role: OrgRoleEnum) {
    super(email);
    this.role = role;
  }
}
