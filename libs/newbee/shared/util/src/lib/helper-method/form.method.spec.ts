import { FormControl } from '@angular/forms';
import { getErrorMessage } from './form.method';

describe('FormMethod', () => {
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
});
