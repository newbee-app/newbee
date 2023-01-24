import type { User } from '@newbee/shared/util';

/**
 * The DTO sent from the frontend to the backend for updating the user's value.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateUserDto implements Partial<Omit<User, 'id'>> {
  /**
   * The user's new email. This should be globally unique.
   */
  email?: string;

  /**
   * The user's new full name.
   */
  name?: string;

  /**
   * The user's new display name, which will be displayed on the platform regardless of the name value.
   * If the value is null, the user's name will be displayed.
   */
  displayName?: string | null;

  /**
   * The user's new phone number.
   */
  phoneNumber?: string | null;

  /**
   * Whether the user wants to deactivate or reactivate their account.
   */
  active?: boolean;

  /**
   * Whether the user is now currently logged in and on the platform.
   */
  online?: boolean;
}
