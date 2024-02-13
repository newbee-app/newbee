import { AdminControls, UserInvites } from '../entity';

/**
 * The AdminControls interface with relevant relationship information.
 */
export interface AdminControlsRelation {
  /**
   * The admin controls.
   */
  readonly adminControls: AdminControls;

  /**
   * All of the users currently on the waitlist in a paginated format.
   */
  readonly waitlist: UserInvites[];
}
