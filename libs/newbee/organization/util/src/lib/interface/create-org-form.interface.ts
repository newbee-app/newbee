/**
 * An interface representing a create organization form.
 */
export interface CreateOrgForm {
  /**
   * The name of the organization.
   */
  name: string | null;

  /**
   * The slug to use to represent the organization.
   */
  slug: string | null;
}
