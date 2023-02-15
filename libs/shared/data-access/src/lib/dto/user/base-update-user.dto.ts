import { BaseCreateUserDto } from './base-create-user.dto';

/**
 * The DTO sent from the frontend to the backend for updating the user's value.
 * Suitable for use in PATCH requests.
 */
export class BaseUpdateUserDto implements Partial<BaseCreateUserDto> {
  /**
   * @inheritdoc
   */
  email?: string;

  /**
   * @inheritdoc
   */
  name?: string;

  /**
   * @inheritdoc
   */
  displayName?: string | null;

  /**
   * @inheritdoc
   */
  phoneNumber?: string | null;
}
