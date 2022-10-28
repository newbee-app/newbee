import { AbstractControl } from '@angular/forms';

export function getErrorMessage(control: AbstractControl | null): string {
  if (control?.hasError('required')) {
    return 'You must enter a value';
  } else if (control?.hasError('email')) {
    return 'Not a valid email';
  } else if (control?.hasError('phoneNumber')) {
    const phoneNumberError = control.getError('phoneNumber');
    if (phoneNumberError.missingCountry) {
      return 'You must select a country';
    } else if (phoneNumberError.invalidNumber) {
      return 'Not a valid phone number';
    } else if (phoneNumberError.invalidCountry) {
      return 'Not a valid country';
    } else if (phoneNumberError.invalid) {
      return 'Not a valid phone number or country';
    }
  }

  return '';
}
