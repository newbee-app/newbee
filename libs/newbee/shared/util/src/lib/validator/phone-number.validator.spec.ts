import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Country } from '../class';
import { testCountry1 } from '../example';
import { PhoneInput } from '../interface';
import { phoneNumberValidator } from './phone-number.validator';

describe('phoneNumberValidator', () => {
  const validator = phoneNumberValidator();
  let control: AbstractControl<Partial<PhoneInput>>;

  beforeEach(() => {
    control = new FormGroup({
      country: new FormControl<Country | null>(null),
      number: new FormControl(''),
    });
  });

  it('should be null if number is falsy', () => {
    expect(validator(control)).toBeNull();
    control.patchValue({ country: testCountry1 });
    expect(validator(control)).toBeNull();
  });

  it('should return missingCountry if number is truthy and country is falsy', () => {
    control.patchValue({ number: '555' });
    expect(validator(control)).toEqual({
      phoneNumber: { missingCountry: true },
    });
  });

  it('should return invalidNumber if both number and country are truthy, but the number is not valid', () => {
    control.patchValue({ country: testCountry1, number: '5555555555' });
    expect(validator(control)).toEqual({
      phoneNumber: { invalidNumber: true },
    });
  });

  it('should return invalidCountry if both number and country are truthy, but the country is not valid', () => {
    control.patchValue({
      country: { name: 'XX', dialingCode: '0', regionCode: 'XX' },
      number: '5555555555',
    });
    expect(validator(control)).toEqual({
      phoneNumber: { invalidCountry: true },
    });
  });
});
