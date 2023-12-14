import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  CountryService,
  SelectOption,
  testCountry1,
  testCountry2,
} from '@newbee/newbee/shared/util';
import { PhoneInputComponent } from './phone-input.component';

jest.mock('@floating-ui/dom', () => ({
  __esModule: true,
  autoUpdate: jest.fn().mockReturnValue(() => {
    return;
  }),
}));

describe('PhoneInputComponent', () => {
  let component: PhoneInputComponent;
  let fixture: ComponentFixture<PhoneInputComponent>;
  let countryService: CountryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneInputComponent],
      providers: [
        {
          provide: CountryService,
          useValue: createMock<CountryService>({
            supportedPhoneCountries: [testCountry1, testCountry2],
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneInputComponent);
    component = fixture.componentInstance;
    countryService = TestBed.inject(CountryService);
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(countryService).toBeDefined();
  });

  describe('init', () => {
    it('should initialize with expected values', () => {
      expect(component.phoneNumber.value).toEqual({
        country: null,
        number: '',
      });
      expect(component.countryOptions).toEqual(
        countryService.supportedPhoneCountries.map(
          (country) =>
            new SelectOption(
              country,
              `${country.name} (+${country.dialingCode})`,
              `${country.regionCode} (+${country.dialingCode})`,
            ),
        ),
      );
      expect(component.clean).toBeTruthy();
      expect(component.onChange).toBeDefined();
      expect(component.onTouched).toBeDefined();
    });
  });

  describe('writeValue', () => {
    it('should change the country', () => {
      component.writeValue({ country: testCountry2, number: '' });
      expect(component.phoneNumber.value).toEqual({
        country: testCountry2,
        number: '',
      });
    });

    it('should change the number', () => {
      component.writeValue({ country: testCountry1, number: '5555555555' });
      expect(component.phoneNumber.value).toEqual({
        country: testCountry1,
        number: '5555555555',
      });
    });
  });

  describe('registerOnChange', () => {
    it('should change dirty', () => {
      component.registerOnChange((val) => {
        val;
      });
      component.phoneNumber.setValue({ country: testCountry1, number: '' });
      expect(component.dirty).toBeTruthy();
    });
  });

  describe('registerOnTouched', () => {
    it('should change touched', () => {
      component.registerOnTouched(() => {
        return;
      });
      component.onTouched();
      expect(component.touched).toBeTruthy();
    });
  });

  describe('setDisabledState', () => {
    it('should update phoneNumber form group', () => {
      component.setDisabledState(true);
      expect(component.phoneNumber.disabled).toBeTruthy();
      component.setDisabledState(false);
      expect(component.phoneNumber.disabled).toBeFalsy();
    });
  });

  describe('displayError', () => {
    it('should display country-related errors for missingCountry or invalidCountry', () => {
      component.onTouched();
      expect(component.displayError('country')).toBeFalsy();
      component.phoneNumber.patchValue({ number: '5' });
      expect(component.displayError('country')).toBeTruthy();
      component.phoneNumber.patchValue({
        country: { name: 'XX', dialingCode: '0', regionCode: 'XX' },
      });
      expect(component.displayError('country')).toBeTruthy();
      component.phoneNumber.patchValue({ country: testCountry1 });
      expect(component.displayError('country')).toBeFalsy();
    });

    it('should only display number-related errors for invalidNumber or invalid', () => {
      component.onTouched();
      expect(component.displayError('number')).toBeFalsy();
      component.phoneNumber.patchValue({ country: testCountry1, number: '5' });
      expect(component.displayError('number')).toBeTruthy();
      expect(component.phoneNumber.patchValue({ number: '2345678901' }));
      expect(component.displayError('number')).toBeFalsy();
    });
  });

  describe('formatNumber', () => {
    it('should do nothing if country or number is falsy', () => {
      component.phoneNumber.patchValue({ number: '5555555555' });
      component.formatNumber();
      expect(component.phoneNumber.value).toEqual({
        country: null,
        number: '5555555555',
      });
    });

    it('should format phoneNumber if country and number is truthy', () => {
      component.phoneNumber.patchValue({
        country: testCountry1,
        number: '5555555555',
      });
      component.formatNumber();
      expect(component.phoneNumber.value.number).toEqual('(555) 555-5555');
    });
  });
});
