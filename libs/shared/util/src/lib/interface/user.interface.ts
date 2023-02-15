/**
 * The information associated with a given user.
 * Stored as an entity in the backend.
 */
export interface User {
  /**
   * The globally unique email of the given user.
   */
  email: string;

  /**
   * The full name of the given user.
   */
  name: string;

  /**
   * How the user's name will be displayed on the platform, regardless of the value of name.
   * If the value is null, the user's name will be displayed.
   */
  displayName: string | null;

  /**
   * The phone number of the given user, stored in the backend in E.164 format.
   */
  phoneNumber: string | null;

  /**
   * Whether the user's account has been deactivated.
   * Needed so that posts made by the user before deactivation has something to refer back to.
   */
  active: boolean;
}
