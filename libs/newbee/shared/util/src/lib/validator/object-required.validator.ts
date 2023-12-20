import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * A validator that ensures that a form control that takes an object has all truthy values.
 *
 * @param includeDisabled Whether to include disabled child controls.
 *
 * @returns `null` if every value of the control's value object is truthy, an object specifying `{ required: true }` if not.
 */
export function objectRequiredValidator(includeDisabled = true): ValidatorFn {
  return (control: AbstractControl<object>): ValidationErrors | null => {
    const controlValue = includeDisabled
      ? control.getRawValue()
      : control.value;
    if (
      typeof controlValue === 'object' &&
      controlValue !== null &&
      Object.values(controlValue).every((value) => !!value)
    ) {
      return null;
    }

    return { required: true };
  };
}
