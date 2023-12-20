import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { Country } from '../class';
import { testCountry1 } from '../example';
import { PhoneInput } from '../interface';
import { objectRequiredValidator } from './object-required.validator';

describe('objectRequiredValidator', () => {
  let validator: ValidatorFn;
  let control: AbstractControl<Partial<PhoneInput>>;
  const requiredError = { required: true };

  beforeEach(() => {
    validator = objectRequiredValidator();
    control = new FormGroup({
      country: new FormControl<Country | null>(null),
      number: new FormControl(''),
    });
  });

  it('should specify the required error if any value is falsy', () => {
    expect(validator(control)).toEqual(requiredError);

    control.patchValue({ country: testCountry1 });
    expect(validator(control)).toEqual(requiredError);

    control.patchValue({ number: '5555555555' });
    expect(validator(control)).toBeNull();

    control.patchValue({ country: null });
    control.get('country')?.disable();
    expect(validator(control)).toEqual(requiredError);
    validator = objectRequiredValidator(false);
    expect(validator(control)).toBeNull();
  });
});
