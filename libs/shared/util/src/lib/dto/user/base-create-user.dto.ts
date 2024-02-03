import type { PublicUser } from '../../interface';

/**
 * A DTO for sending the necessary information to register a new user from the frontend to the backend.
 * Suitable for use in POST requests.
 */
export class BaseCreateUserDto implements PublicUser {
  /**
   * @inheritdoc
   */
  email!: string;

  /**
   * @inheritdoc
   */
  name!: string;

  /**
   * @inheritdoc
   */
  displayName: string | null = null;

  /**
   * @inheritdoc
   */
  phoneNumber: string | null = null;
}
