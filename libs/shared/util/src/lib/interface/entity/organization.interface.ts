/**
 * The information associated with an organization.
 * Stored as an entity in the backend.
 */
export interface Organization {
  /**
   * The unique name for the organization, as it will be displayed on the platform.
   */
  name: string;

  /**
   * The globally unique slug for the organization, auto-generated based on the provided name.
   */
  slug: string;
}
