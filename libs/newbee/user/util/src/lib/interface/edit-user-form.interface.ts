import type { PhoneInput } from '@newbee/newbee/shared/util';

/**
 * An interface representing an edit user form.
 */
export interface EditUserForm {
  /**
   * The user's new name.
   */
  name: string | null;

  /**
   * The user's new display name.
   */
  displayName?: string | null;

  /**
   * The user's new phone number.
   */
  phoneNumber?: PhoneInput | null;
}
