import { AdminControls, WaitlistMember } from '../entity';
import { PaginatedResults } from '../util';

/**
 * The AdminControls interface with relevant relationship information.
 */
export interface AdminControlsRelation {
  /**
   * The admin controls.
   */
  readonly adminControls: AdminControls;

  /**
   * All of the possible users currently on the waitlist, in a paginated format.
   */
  readonly waitlist: PaginatedResults<WaitlistMember>;
}
