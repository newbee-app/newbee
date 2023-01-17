import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testCountry1 } from '../example';
import { PhoneNumberPipeModule } from '../pipe';
import { PhoneNumberInputDirective } from './phone-number-input.directive';

@Component({
  template: `
    <input id="input" type="text" newbeePhoneNumberInput [country]="country" />
  `,
})
class TestComponent {
  country = testCountry1;
}

describe('PhoneNumberInputDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: () => HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [PhoneNumberPipeModule],
      declarations: [TestComponent, PhoneNumberInputDirective],
    }).createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    inputElement = () => fixture.nativeElement.querySelector('#input');
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(inputElement).toBeDefined();
  });

  describe('focus', () => {
    it('should deformat phone number', () => {
      inputElement().value = '(555) 555-5555';
      inputElement().dispatchEvent(new FocusEvent('focus'));
      expect(inputElement().value).toEqual('5555555555');
    });
  });

  describe('blur', () => {
    it('should format phone number', () => {
      inputElement().value = '5555555555';
      inputElement().dispatchEvent(new FocusEvent('blur'));
      expect(inputElement().value).toEqual('(555) 555-5555');
    });
  });
});
