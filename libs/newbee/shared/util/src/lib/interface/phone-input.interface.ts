import { Country } from '../class';

/**
 * An interface representing a phone number's form control input.
 */
export interface PhoneInput {
  /**
   * The country the phone number belongs to.
   */
  country: Country | null;

  /**
   * The phone number as a string.
   */
  number: string | null;
}
