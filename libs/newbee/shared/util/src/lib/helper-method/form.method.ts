import { AbstractControl } from '@angular/forms';

export function getErrorMessage(control: AbstractControl | null): string {
  if (control?.hasError('required')) {
    return 'You must enter a value';
  } else if (control?.hasError('email')) {
    return 'Not a valid email';
  } else if (control?.hasError('phoneNumber')) {
    const phoneNumberError = control.getError('phoneNumber');
    if (phoneNumberError.missingRegion) {
      return 'Missing country code';
    } else if (phoneNumberError.invalid) {
      return 'Not a valid phone number';
    }
  }

  return '';
}
