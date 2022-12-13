import { PhoneInput } from '@newbee/newbee/shared/util';

/**
 * An interface representing a login form.
 */
export interface LoginForm {
  /**
   * The log in email.
   */
  email: string | null;
}

/**
 * An interface representing a register form.
 */
export interface RegisterForm {
  /**
   * The register email.
   */
  email: string | null;

  /**
   * The full name of the new user.
   */
  name: string | null;

  /**
   * The display name for the new user.
   */
  displayName?: string | null;

  /**
   * The phone number of the new user.
   */
  phoneNumber?: PhoneInput | null;
}
