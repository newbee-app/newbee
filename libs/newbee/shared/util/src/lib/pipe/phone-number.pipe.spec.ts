import { PhoneNumberFormat } from 'google-libphonenumber';
import { testCountry1 } from '../example';
import { PhoneNumberPipe } from './phone-number.pipe';

describe('PhoneNumberPipe', () => {
  let pipe: PhoneNumberPipe;

  beforeEach(() => {
    pipe = new PhoneNumberPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should transform a phone number string', () => {
      expect(pipe.transform('5555555555', testCountry1)).toEqual(
        '(555) 555-5555'
      );
      expect(
        pipe.transform('5555555555', testCountry1, PhoneNumberFormat.E164)
      ).toEqual('+15555555555');
    });

    it('should fail gracefully without country', () => {
      expect(pipe.transform('5555555555')).toEqual('5555555555');
    });
  });

  describe('parse', () => {
    it('should parse a transformed phone number string', () => {
      expect(pipe.parse('(555) 555-5555', testCountry1)).toEqual('5555555555');
      expect(pipe.parse('+15555555555', testCountry1)).toEqual('5555555555');
    });

    it('should fail gracefully without country', () => {
      expect(pipe.parse('(555) 555-5555')).toEqual('(555) 555-5555');
    });
  });
});
