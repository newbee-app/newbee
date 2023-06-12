/**
 * An interface representing a creating/editing organization form.
 */
export interface OrgForm {
  /**
   * The name of the organization.
   */
  name: string | null;

  /**
   * The slug to use to represent the organization.
   */
  slug: string | null;
}
