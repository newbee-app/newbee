import { User } from '@newbee/shared/util';

/**
 * A DTO for sending the necessary information to register a new user from the frontend to the backend.
 * Suitable for use in POST requests.
 */
export class BaseCreateUserDto implements Omit<User, 'id' | 'active'> {
  /**
   * The new user's email. This should be globally unique.
   */
  email!: string;

  /**
   * The new user's full name.
   */
  name!: string;

  /**
   * The new user's display name, which will be displayed on the platform regardless of the name value.
   * If the value is null, the user's name will be displayed.
   */
  displayName: string | null = null;

  /**
   * The new user's phone number.
   */
  phoneNumber: string | null = null;
}
