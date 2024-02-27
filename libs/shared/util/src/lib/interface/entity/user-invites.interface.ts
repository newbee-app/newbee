import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * The information associated with user invites.
 * Stored as an entity in the backend.
 */
export interface UserInvites extends CommonEntityFields {
  /**
   * The unique email of the user who was invited.
   */
  readonly email: string;
}
