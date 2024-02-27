import { CommonEntityFields } from './common-entity-fields.interface';

/**
 * The information associated with an organization.
 * Stored as an entity in the backend.
 */
export interface Organization extends CommonEntityFields {
  /**
   * The unique name for the organization, as it will be displayed on the platform.
   */
  readonly name: string;

  /**
   * The globally unique slug for the organization, auto-generated based on the provided name.
   */
  readonly slug: string;

  /**
   * The amount of time to wait before marking any child posts as out-of-date, represented as an ISO 8601 duration string.
   */
  readonly upToDateDuration: string;
}
