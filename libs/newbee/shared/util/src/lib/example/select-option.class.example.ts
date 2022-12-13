import { SelectOption } from '../class';
import { testCountry1, testCountry2 } from './country.class.example';

/**
 * An example instance of `SelectOption`.
 * Strictly for use in testing.
 */
export const testSelectOption1 = new SelectOption(
  testCountry1,
  `${testCountry1.name} (+${testCountry1.dialingCode})`,
  `${testCountry1.regionCode} (+${testCountry1.dialingCode})`
);

/**
 * An example instance of `SelectOption`.
 * Strictly for use in testing.
 */
export const testSelectOption2 = new SelectOption(
  testCountry2,
  `${testCountry2.name} (+${testCountry2.dialingCode})`,
  `${testCountry2.regionCode} (+${testCountry2.dialingCode})`
);
