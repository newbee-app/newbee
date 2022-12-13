import { AbstractControl } from '@angular/forms';

/**
 * A helper function for extracting form control input errors for display.
 *
 * @param control The control to look for errors.
 * @returns The form control input's errors if they have any, an empty string if they don't.
 */
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
