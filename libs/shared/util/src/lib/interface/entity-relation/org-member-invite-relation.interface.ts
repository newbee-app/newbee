import type { Organization, OrgMemberInvite, UserInvites } from '../entity';

/**
 * The OrgMemberInvite interface with relevant relationship information.
 */
export interface OrgMemberInviteRelation {
  /**
   * The token and role for the org member invite.
   */
  readonly orgMemberInvite: OrgMemberInvite;

  /**
   * The name and slug of the organization the invite is attached to.
   */
  readonly organization: Organization;

  /**
   * The email of the user who was invited.
   */
  readonly userInvites: UserInvites;
}

/**
 * OrgMemberInviteRelation without user invites information.
 */
export type OrgMemberInviteNoUser = Omit<
  OrgMemberInviteRelation,
  'userInvites'
>;
