import type { Organization, User } from '../entity';
import { OrgMemberInviteNoUser } from './org-member-invite-relation.interface';
import { OrgMemberNoUser } from './org-member-relation.interface';

/**
 * The User interface with relevant relationship information.
 */
export interface UserRelation {
  /**
   * The email, name, display name, and phone number of the user.
   */
  user: User;

  /**
   * The names and slugs of the organizations the user is a part of.
   */
  organizations: Organization[];

  /**
   * The organization the user is currently viewing, including:
   * - The role they hold in the org
   * - The teams they're a part of in the org, and the roles they have in each team
   * - The posts they created and maintain in the org
   */
  selectedOrganization: OrgMemberNoUser | null;

  /**
   * The pending org member invites for the user, including:
   * - The token and role for the org member invite
   * - The name and slug of the organization the invite is attached to
   */
  invites: OrgMemberInviteNoUser[];
}
