import { forbiddenError, testUser1 } from '@newbee/shared/util';
import { Country, SelectOption, Toast } from '../class';
import { AlertType, ToastXPosition, ToastYPosition } from '../enum';
import type {
  HttpClientError,
  HttpScreenError,
  PhoneInput,
} from '../interface';

/**
 * An example instance of `Country`.
 * Strictly for use in testing.
 */
export const testCountry1 = new Country('United States', 'US', '1');

/**
 * An example instance of `Country`.
 * Strictly for use in testing.
 */
export const testCountry2 = new Country('South Korea', 'KR', '82');

/**
 * An example instance of `HttpClientError`.
 * Strictly for use in testing.
 */
export const testHttpClientError1: HttpClientError = {
  status: 400,
  messages: { misc: 'error' },
};

/**
 * An example instance of `HttpScreenError`.
 * Strictly for use in testing.
 */
export const testHttpScreenError1: HttpScreenError = {
  status: 403,
  message: forbiddenError,
};

/**
 * An example instance of `PhoneInput`.
 * Strictly for use in testing.
 */
export const testPhoneInput1: PhoneInput = {
  country: testCountry1,
  number: (testUser1.phoneNumber as string).slice(2),
};

/**
 * An example instance of `SelectOption` using `Country`.
 * Strictly for use in testing.
 */
export const testSelectOptionCountry1 = new SelectOption(
  testCountry1,
  `${testCountry1.name} (+${testCountry1.dialingCode})`,
  `${testCountry1.regionCode} (+${testCountry1.dialingCode})`,
);

/**
 * An example instance of `SelectOption` using `Country`.
 * Strictly for use in testing.
 */
export const testSelectOptionCountry2 = new SelectOption(
  testCountry2,
  `${testCountry2.name} (+${testCountry2.dialingCode})`,
  `${testCountry2.regionCode} (+${testCountry2.dialingCode})`,
);

/**
 * An example instance of `Toast`.
 * Strictly for use in testing.
 */
export const testToast1: Toast = {
  id: '1',
  header: 'Header',
  text: 'Text',
  type: AlertType.Error,
  position: [ToastXPosition.Center, ToastYPosition.Bottom],
  duration: 1000,
};
