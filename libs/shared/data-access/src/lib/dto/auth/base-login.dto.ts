import type { User } from '@newbee/shared/util';

/**
 * The DTO sent from the backend to the frontend after authenticating a registered user.
 */
export class BaseLoginDto {
  /**
   * The JWT the user should include in future requests.
   */
  access_token!: string;

  /**
   * The user object for the frontend to use.
   */
  user!: User;
}
