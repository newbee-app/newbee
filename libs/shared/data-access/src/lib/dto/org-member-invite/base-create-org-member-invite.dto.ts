import { OrgRoleEnum } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend to create a new OrgMemberInviteEntity.
 * Suitable for use in POST requests.
 */
export class BaseCreateOrgMemberInviteDto {
  /**
   * The email of the user to invite.
   */
  email!: string;

  /**
   * The role the user would have in the organization.
   */
  role!: OrgRoleEnum;
}
