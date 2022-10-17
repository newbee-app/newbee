import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { testCountry1, testCountry2 } from '@newbee/newbee/shared/util';
import { SearchableSelectModule } from '../searchable-select/searchable-select.component';

import { PhoneInputComponent } from './phone-input.component';

describe('PhoneInputComponent', () => {
  let component: PhoneInputComponent;
  let fixture: ComponentFixture<PhoneInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, SearchableSelectModule],
      declarations: [PhoneInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneInputComponent);
    component = fixture.componentInstance;
    jest.spyOn(component.phoneNumber, 'emit');
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('init', () => {
    it('should initialize with expected values', () => {
      expect(component.selectedCountry).toEqual(testCountry1);
      expect(component.defaultCountry).toEqual(testCountry1.regionCode);
    });
  });

  describe('selectedCountry', () => {
    it('should return the selected country', () => {
      component.selectCountry(testCountry2.regionCode);
      expect(component.selectedCountry).toEqual(testCountry2);
    });
  });

  describe('emitPhoneNumber', () => {
    it('should parse the value, set the control in national format, and emit in international format', () => {
      component.phoneNumberControl.setValue('5555555555');
      fixture.detectChanges();

      expect(component.phoneNumberControl.value).toEqual('(555) 555-5555');
      expect(component.phoneNumber.emit).toBeCalledTimes(1);
      expect(component.phoneNumber.emit).toBeCalledWith('+15555555555');
    });
  });

  describe('selectCountry', () => {
    it('should change the selected country and not emit if input is null', () => {
      component.selectCountry('KR');
      fixture.detectChanges();

      expect(component.selectedCountry).toEqual(testCountry2);
      expect(component.phoneNumber.emit).not.toBeCalled();
    });
  });

  it('should change the selected country and emit if input is not null', () => {
    component.phoneNumberControl.setValue('0555555555');
    fixture.detectChanges();

    component.selectCountry('KR');
    fixture.detectChanges();

    expect(component.selectedCountry).toEqual(testCountry2);
    expect(component.phoneNumber.emit).toBeCalledTimes(2);
    expect(component.phoneNumber.emit).toBeCalledWith('+82555555555');
  });
});
