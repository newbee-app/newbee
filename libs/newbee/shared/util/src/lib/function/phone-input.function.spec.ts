import { testCountry1 } from '../example';
import type { PhoneInput } from '../interface';
import { phoneInputToString } from './phone-input.function';

describe('PhoneInput functions', () => {
  describe('phoneInputToString', () => {
    it('should convert phone input to string', () => {
      const phoneInput: PhoneInput = {
        country: testCountry1,
        number: '2025550122',
      };
      expect(phoneInputToString(phoneInput)).toEqual('+12025550122');
    });
  });
});
