import type { Organization, User } from '../entity';
import { OrgMemberInviteNoUser } from './org-member-invite-relation.interface';

/**
 * The User interface with relationship information, only for the logged in user.
 */
export interface UserRelation {
  /**
   * The user themselves.
   */
  readonly user: User;

  /**
   * The organizations the user is a part of.
   */
  readonly organizations: Organization[];

  /**
   * The pending org member invites for the user, including:
   * - The token and role for the org member invite
   * - The name and slug of the organization the invite is attached to
   */
  readonly invites: OrgMemberInviteNoUser[];
}
