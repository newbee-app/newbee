import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { PhoneInput } from '../interface';

export function phoneNumberValidator(): ValidatorFn {
  const phoneUtil = PhoneNumberUtil.getInstance();

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
      const phoneNumber = phoneUtil.parse(number, country.regionCode);
      if (
        !phoneUtil.isPossibleNumber(phoneNumber) ||
        !phoneUtil.isValidNumber(phoneNumber)
      ) {
        return { phoneNumber: { invalidNumber: true } };
      }
    } catch (err) {
      return { phoneNumber: { invalid: true } };
    }

    return null;
  };
}
