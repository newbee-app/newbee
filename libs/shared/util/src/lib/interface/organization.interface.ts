/**
 * The information associated with an organization.
 * Stored as an entity in the backend.
 */
export interface Organization {
  /**
   * The globally unique name for the organization.
   */
  name: string;

  /**
   * How the organization's name will be displayed on the platform, regardless of the value of name.
   * If the value is null, the organization's name will be displayed.
   */
  displayName: string | null;
}
