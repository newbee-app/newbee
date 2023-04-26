import { SelectOption } from '../class';
import { testCountry1, testCountry2 } from './country.class.example';

/**
 * An example instance of `SelectOption` using `Country`.
 * Strictly for use in testing.
 */
export const testSelectOptionCountry1 = new SelectOption(
  testCountry1,
  `${testCountry1.name} (+${testCountry1.dialingCode})`,
  `${testCountry1.regionCode} (+${testCountry1.dialingCode})`
);

/**
 * An example instance of `SelectOption` using `Country`.
 * Strictly for use in testing.
 */
export const testSelectOptionCountry2 = new SelectOption(
  testCountry2,
  `${testCountry2.name} (+${testCountry2.dialingCode})`,
  `${testCountry2.regionCode} (+${testCountry2.dialingCode})`
);

/**
 * An example instance of `SelectOption` using `string`.
 * Strictly for use in testing.
 */
export const testSelectOptionString1 = new SelectOption('Org 1', 'Org 1');

/**
 * An example instance of `SelectOption` using `string`.
 * Strictly for use in testing.
 */
export const testSelectOptionString2 = new SelectOption('Org 2', 'Org 2');
