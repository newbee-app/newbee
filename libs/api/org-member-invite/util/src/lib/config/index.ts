import { registerAs } from '@nestjs/config';
import type { AppConfig } from '@newbee/api/shared/util';

/**
 * The structure of the org member invite module's config.
 */
export interface OrgMemberInviteConfig {
  /**
   * The link to the frontend page where the user can accept an invite to join an organization.
   */
  acceptLink: string;

  /**
   * The link to the frontend page where the user can decline an invite to join an organization.
   */
  declineLink: string;
}

/**
 * The structure of the app config with the org member invite config.
 */
export interface AppOrgMemberInviteConfig extends AppConfig {
  /**
   * The org member invite config, which exists only in the org member invite module or modules that import the org member invite module.
   */
  orgMemberInvite: OrgMemberInviteConfig;
}

export default registerAs(
  'orgMemberInvite',
  (): OrgMemberInviteConfig => ({
    acceptLink: process.env['ORG_MEMBER_INVITE_ACCEPT_LINK'] as string,
    declineLink: process.env['ORG_MEMBER_INVITE_DECLINE_LINK'] as string,
  })
);
