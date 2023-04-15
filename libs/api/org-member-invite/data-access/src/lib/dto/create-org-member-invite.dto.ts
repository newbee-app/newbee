import { EmailDto } from '@newbee/api/shared/data-access';
import { BaseCreateOrgMemberInviteDto } from '@newbee/shared/data-access';
import { OrgRoleEnum, orgRoleIsEnum } from '@newbee/shared/util';
import { IsEnum } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to create a new OrgMemberInviteEntity.
 * Suitable for use in POST requests.
 */
export class CreateOrgMemberInviteDto
  extends EmailDto
  implements BaseCreateOrgMemberInviteDto
{
  /**
   * @inheritdoc
   */
  @IsEnum(OrgRoleEnum, { message: orgRoleIsEnum })
  role!: OrgRoleEnum;
}
