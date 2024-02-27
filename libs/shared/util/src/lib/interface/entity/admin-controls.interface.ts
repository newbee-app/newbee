import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * The things a NewBee admin can control.
 */
export interface AdminControls extends CommonEntityFields {
  /**
   * Whether new users are allowed to register.
   */
  readonly allowRegistration: boolean;

  /**
   * Whether to allow a waitlist, only relevant when registration is disallowed.
   */
  readonly allowWaitlist: boolean;
}

/**
 * The public admin controls information that is passed around to non-admins.
 */
export type PublicAdminControls = Omit<AdminControls, keyof CommonEntityFields>;
