import {
  BaseUpdateOrgMemberDto,
  OrgRoleEnum,
  orgRoleIsEnum,
} from '@newbee/shared/util';
import { IsEnum } from 'class-validator';

/**
 * The verifiable DTO sent from the frontend to the backend to update an org member.
 * Suitable for use in PATCH requests.
 */
export class UpdateOrgMemberDto implements BaseUpdateOrgMemberDto {
  /**
   * @inheritdoc
   */
  @IsEnum(OrgRoleEnum, { message: orgRoleIsEnum })
  role!: OrgRoleEnum;
}
