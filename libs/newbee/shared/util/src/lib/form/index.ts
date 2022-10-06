import { AbstractControl } from '@angular/forms';

export function getErrorMessage(control: AbstractControl | null): string {
  if (control?.hasError('required')) {
    return 'You must enter a value';
  } else if (control?.hasError('email')) {
    return 'Not a valid email';
  }

  return '';
}
