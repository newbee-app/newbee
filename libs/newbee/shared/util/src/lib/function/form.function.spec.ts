import { FormControl, Validators } from '@angular/forms';
import { testUser1 } from '@newbee/shared/util';
import {
  inputDisplayError,
  inputErrorMessage,
  inputIsClean,
  inputIsValid,
} from './form.function';

describe('FormFunction', () => {
  describe('inputErrorMessage', () => {
    let control: FormControl<string | null>;

    beforeEach(() => {
      control = new FormControl('');
    });

    it('should work for required', () => {
      control.setErrors({ required: true });
      expect(inputErrorMessage(control)).toEqual('You must enter a value');
    });

    it('should work for email', () => {
      control.setErrors({ email: true });
      expect(inputErrorMessage(control)).toEqual('Not a valid email');
    });

    describe('phoneNumber', () => {
      it('should work for missingCountry', () => {
        control.setErrors({ phoneNumber: { missingCountry: true } });
        expect(inputErrorMessage(control)).toEqual('You must select a country');
      });

      it('should work for invalidNumber', () => {
        control.setErrors({ phoneNumber: { invalidNumber: true } });
        expect(inputErrorMessage(control)).toEqual('Not a valid phone number');
      });

      it('should work for invalidCountry', () => {
        control.setErrors({ phoneNumber: { invalidCountry: true } });
        expect(inputErrorMessage(control)).toEqual('Not a valid country');
      });

      it('should work for invalid', () => {
        control.setErrors({ phoneNumber: { invalid: true } });
        expect(inputErrorMessage(control)).toEqual(
          'Not a valid phone number or country',
        );
      });
    });
  });

  describe('input checkers', () => {
    let control: FormControl;

    beforeEach(() => {
      control = new FormControl('', Validators.email);
    });

    it('should be marked as clean if pristine and untouched', () => {
      expect(inputIsClean(control)).toBeTruthy();
      control.markAsDirty();
      expect(inputIsClean(control)).toBeFalsy();
      control.markAsPristine();
      control.markAsTouched();
      expect(inputIsClean(control)).toBeFalsy();
    });

    it('should be marked as not clean if dirty', () => {
      control.markAsDirty();
      expect(inputIsClean(control)).toBeFalsy();
    });

    it('should be marked as not clean if touched', () => {
      control.markAsTouched();
      expect(inputIsClean(control)).toBeFalsy();
    });

    it('should only be marked as valid if valid', () => {
      control.setValue(testUser1.email);
      expect(inputIsValid(control)).toBeTruthy();
      control.setValue('bademail');
      expect(inputIsValid(control)).toBeFalsy();
    });

    it('should only display error if input is not clean and not valid', () => {
      expect(inputDisplayError(null)).toBeFalsy();
      expect(inputDisplayError(control)).toBeFalsy();
      control.markAsTouched();
      expect(inputDisplayError(control)).toBeFalsy();
      control.setValue('bademail');
      expect(inputDisplayError(control)).toBeTruthy();
      control.markAsUntouched();
      expect(inputDisplayError(control)).toBeFalsy();
    });
  });
});
