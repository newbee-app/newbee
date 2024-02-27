import { AdminControlsRelation, PaginatedResults, User } from '../../interface';

/**
 * The DTO sent from the backend to the frontend whenever an admin is looking at the admin panel.
 */
export class AdminControlsRelationAndUsersDto {
  /**
   * @param adminControlsRelation The admin controls and its related entities.
   * @param users All of the NewBee users in paginated format.
   */
  constructor(
    readonly adminControlsRelation: AdminControlsRelation,
    readonly users: PaginatedResults<User>,
  ) {}
}
