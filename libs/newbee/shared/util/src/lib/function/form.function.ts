import { AbstractControl, FormGroup } from '@angular/forms';

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
 * Gets an input from a form group and check that it's clean (pristine and untouched).
 *
 * @param formGroup The form group to check.
 * @param inputName The name of the form group's input to look at.
 *
 * @returns `true` if the input is clean, `false` otherwise.
 */
export function inputIsClean(formGroup: FormGroup, inputName: string): boolean {
  const input = formGroup.get(inputName);
  return !!input?.pristine && !!input.untouched;
}

/**
 * Whether the given input is valid.
 *
 * @param formGroup The form group to check.
 * @param inputName The name of the form group's input to look at.
 *
 * @returns `true` if the input is valid, `false` otherwise.
 */
export function inputIsValid(formGroup: FormGroup, inputName: string): boolean {
  const input = formGroup.get(inputName);
  return !!input?.valid;
}

/**
 * Whether to display the input as having an error.
 *
 * @param formGroup The form group to check.
 * @param inputName The name of the form group's input to look at.
 *
 * @returns `true` if the input should display an error, `false` otherwise.
 */
export function inputDisplayError(
  formGroup: FormGroup,
  inputName: string
): boolean {
  return (
    !inputIsClean(formGroup, inputName) && !inputIsValid(formGroup, inputName)
  );
}
