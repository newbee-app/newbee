import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * The information associated with a given waitlist member.
 * Stored as an entity in the backend.
 */
export interface WaitlistMember extends CommonEntityFields {
  /**
   * The unique email of the given waitlist member.
   */
  readonly email: string;

  /**
   * The full name of the given waitlist member.
   */
  readonly name: string;
}
