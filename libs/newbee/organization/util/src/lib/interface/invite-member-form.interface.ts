import { OrgRoleEnum } from '@newbee/shared/util';

/**
 * An interface representing an invite member form.
 */
export interface InviteMemberForm {
  /**
   * The email of the user to invite.
   */
  email: string | null;

  /**
   * The role of the user to invite.
   */
  role: OrgRoleEnum | null;
}
