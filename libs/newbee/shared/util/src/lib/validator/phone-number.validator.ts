import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const region: string = control.get('region')?.value ?? '';
    const number = control.get('number')?.value ?? '';
    const phoneNumber = phoneUtil.parse(
      control.get('number')?.value ?? '',
      region
    );

    const missingRegion = number && !region;
    const invalid =
      !phoneUtil.isPossibleNumber(phoneNumber) ||
      !phoneUtil.isValidNumber(phoneNumber);

    return missingRegion || invalid
      ? {
          phoneNumber: {
            ...(missingRegion && { missingRegion }),
            ...(invalid && { invalid }),
          },
        }
      : null;
  };
}
