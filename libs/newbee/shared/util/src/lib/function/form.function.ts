import { AbstractControl } from '@angular/forms';

/**
 * A helper function for extracting form control input errors for display.
 *
 * @param control The control to look for errors.
 * @returns The form control input's errors if they have any, an empty string if they don't.
 */
export function inputErrorMessage(control: AbstractControl | null): string {
  if (control?.hasError('required')) {
    return 'You must enter a value';
  } else if (control?.hasError('email')) {
    return 'Not a valid email';
  } else if (control?.hasError('pattern')) {
    return 'You must match the specified pattern';
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

/**
 * Checks whether a form control is clean (pristine and untouched).
 *
 * @param control The control to check.
 *
 * @returns `true` if the input is clean, `false` otherwise.
 */
export function inputIsClean(control: AbstractControl | null): boolean {
  return !!control?.pristine && control.untouched;
}

/**
 * Whether the given form control is valid.
 *
 * @param control The control to check.
 *
 * @returns `true` if the input is valid, `false` otherwise.
 */
export function inputIsValid(control: AbstractControl | null): boolean {
  return !!control?.valid;
}

/**
 * Whether to display the form control as having an error.
 *
 * @param control The control to check.
 *
 * @returns `true` if the input should display an error, `false` otherwise.
 */
export function inputDisplayError(control: AbstractControl | null): boolean {
  return !inputIsClean(control) && !inputIsValid(control);
}
