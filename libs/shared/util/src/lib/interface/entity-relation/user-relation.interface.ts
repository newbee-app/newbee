import type { User } from '../entity';
import { OrgMemberInviteRelation } from './org-member-invite-relation.interface';
import { OrgMemberRelation } from './org-member-relation.interface';

/**
 * The User interface with relevant relationship information.
 */
export interface UserRelation {
  /**
   * The email, name, display name, and phone number of the user.
   */
  user: User;

  /**
   * The organizations the user is a part of, including:
   * - The role they hold in the org
   * - The teams they're a part of in the org, and the roles they have in each team
   * - The posts they created and maintain in the org
   */
  organizations: Omit<OrgMemberRelation, 'user'>[];

  /**
   * The pending org member invites for the user, including:
   * - The token and role for the org member invite
   * - The name and slug of the organization the invite is attached to
   */
  invites: Omit<OrgMemberInviteRelation, 'userInvites'>[];
}
