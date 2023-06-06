import type { Organization, User } from '../entity';
import { OrgMemberInviteNoUser } from './org-member-invite-relation.interface';

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
   * The pending org member invites for the user, including:
   * - The token and role for the org member invite
   * - The name and slug of the organization the invite is attached to
   */
  invites: OrgMemberInviteNoUser[];
}
