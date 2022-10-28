import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import type { CountryCode } from 'libphonenumber-js';
import { ParseError, parsePhoneNumber } from 'libphonenumber-js';
import { PhoneInput } from '../interface';

export function phoneNumberValidator(): ValidatorFn {
  return (
    control: AbstractControl<Partial<PhoneInput>>
  ): ValidationErrors | null => {
    const { country, number } = control.value;

    if (!number) {
      return null;
    }

    if (!country) {
      return {
        phoneNumber: {
          missingCountry: true,
        },
      };
    }

    try {
      const phoneNumber = parsePhoneNumber(
        number,
        country.regionCode as CountryCode
      );
      if (!phoneNumber.isPossible() || !phoneNumber.isValid()) {
        return { phoneNumber: { invalidNumber: true } };
      }
    } catch (err) {
      if (err instanceof ParseError) {
        switch (err.message) {
          case 'INVALID_COUNTRY':
            return { phoneNumber: { invalidCountry: true } };
          case 'NOT_A_NUMBER':
          case 'TOO_SHORT':
          case 'TOO_LONG':
            return { phoneNumber: { invalidNumber: true } };
        }
      }

      return { phoneNumber: { invalid: true } };
    }

    return null;
  };
}
