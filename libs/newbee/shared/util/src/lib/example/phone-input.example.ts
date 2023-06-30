import { testUser1 } from '@newbee/shared/util';
import type { PhoneInput } from '../interface';
import { testCountry1 } from './country.class.example';

/**
 * An example instance of `PhoneInput`.
 * Strictly for use in testing.
 */
export const testPhoneInput1: PhoneInput = {
  country: testCountry1,
  number: (testUser1.phoneNumber as string).slice(2),
};
