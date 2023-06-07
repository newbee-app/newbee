import { FormControl, FormGroup, Validators } from '@angular/forms';
import { testUser1 } from '@newbee/shared/util';
import {
  getErrorMessage,
  inputDisplayError,
  inputIsClean,
  inputIsValid,
} from './form.function';

describe('FormFunction', () => {
  describe('getErrorMessage', () => {
    let control: FormControl<string | null>;

    beforeEach(() => {
      control = new FormControl('');
    });

    it('should work for required', () => {
      control.setErrors({ required: true });
      expect(getErrorMessage(control)).toEqual('You must enter a value');
    });

    it('should work for email', () => {
      control.setErrors({ email: true });
      expect(getErrorMessage(control)).toEqual('Not a valid email');
    });

    describe('phoneNumber', () => {
      it('should work for missingCountry', () => {
        control.setErrors({ phoneNumber: { missingCountry: true } });
        expect(getErrorMessage(control)).toEqual('You must select a country');
      });

      it('should work for invalidNumber', () => {
        control.setErrors({ phoneNumber: { invalidNumber: true } });
        expect(getErrorMessage(control)).toEqual('Not a valid phone number');
      });

      it('should work for invalidCountry', () => {
        control.setErrors({ phoneNumber: { invalidCountry: true } });
        expect(getErrorMessage(control)).toEqual('Not a valid country');
      });

      it('should work for invalid', () => {
        control.setErrors({ phoneNumber: { invalid: true } });
        expect(getErrorMessage(control)).toEqual(
          'Not a valid phone number or country'
        );
      });
    });
  });

  describe('form group functions', () => {
    let group: FormGroup;

    const email = 'email';

    beforeEach(() => {
      group = new FormGroup({
        email: new FormControl('', [Validators.email]),
      });
    });

    it('should be marked as clean if pristine and untouched', () => {
      expect(inputIsClean(group, email)).toBeTruthy();
      group.markAsDirty();
      expect(inputIsClean(group, email)).toBeTruthy();
      group.markAsTouched();
      expect(inputIsClean(group, email)).toBeTruthy();
    });

    it('should be marked as not clean if dirty', () => {
      group.get(email)?.markAsDirty();
      expect(inputIsClean(group, email)).toBeFalsy();
    });

    it('should be marked as not clean if touched', () => {
      group.get(email)?.markAsTouched();
      expect(inputIsClean(group, email)).toBeFalsy();
    });

    it('should only be marked as valid if valid', () => {
      group.setValue({ email: testUser1.email });
      expect(inputIsValid(group, email)).toBeTruthy();
      group.setValue({ email: 'bademail' });
      expect(inputIsValid(group, email)).toBeFalsy();
    });

    it('should only display error if input is not clean and not valid', () => {
      expect(inputDisplayError(group, email)).toBeFalsy();
      group.get(email)?.markAsTouched();
      expect(inputDisplayError(group, email)).toBeFalsy();
      group.setValue({ email: 'bademail' });
      expect(inputDisplayError(group, email)).toBeTruthy();
      group.get(email)?.markAsUntouched();
      expect(inputDisplayError(group, email)).toBeFalsy();
    });
  });
});
