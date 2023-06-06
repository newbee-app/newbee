/**
 * An interface representing a create organization form.
 */
export interface CreateOrgForm {
  /**
   * The name of the organization to create.
   */
  name: string | null;

  /**
   * The slug to use to represent the organization.
   * If not specified, the backend will auto-generate one depending on availability.
   */
  slug?: string | null;
}
