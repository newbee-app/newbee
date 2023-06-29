import { testCountry1 } from '@newbee/newbee/shared/util';
import { testUser1 } from '@newbee/shared/util';
import { LoginForm, RegisterForm } from '../interface';

const { email, name, displayName, phoneNumber } = testUser1;

/**
 * An example instance of `LoginForm`.
 * Strictly for use in testing.
 */
export const testLoginForm1: LoginForm = { email };

/**
 * An example instance of `RegisterForm`.
 * Strictly for use in testing.
 */
export const testRegisterForm1: RegisterForm = {
  email,
  name,
  displayName,
  phoneNumber: { country: testCountry1, number: phoneNumber?.slice(2) ?? null },
};
