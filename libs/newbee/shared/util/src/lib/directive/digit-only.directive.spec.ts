import { Component, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DigitOnlyDirective } from './digit-only.directive';

@Component({
  template: ` <input id="input" type="text" newbeeDigitOnly /> `,
})
class TestComponent {
  constructor(public readonly renderer: Renderer2) {}
}

describe('DigitOnlyDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: () => HTMLInputElement;

  const lettersAsString = 'abcdefghijklmnopqrstuvwxyz';
  const lcLetters = lettersAsString.split('');
  const ucLetters = lettersAsString.toUpperCase().split('');
  const allLetters = lcLetters.concat(ucLetters);

  const numbersAsString = '1234567890';
  const numbers = numbersAsString.split('');

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, DigitOnlyDirective],
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

  describe('letter input', () => {
    it('should not allow letter input', () => {
      allLetters.forEach((letter) => {
        expect(
          inputElement().dispatchEvent(
            new InputEvent('beforeinput', { data: letter, cancelable: true })
          )
        ).toBeFalsy();
        expect(
          inputElement().dispatchEvent(
            new KeyboardEvent('keydown', { key: letter, cancelable: true })
          )
        ).toBeFalsy();
      });
    });
  });

  describe('number input', () => {
    it('should allow number input', () => {
      numbers.forEach((num) => {
        expect(
          inputElement().dispatchEvent(
            new InputEvent('beforeinput', { data: num, cancelable: true })
          )
        ).toBeTruthy();
        expect(
          inputElement().dispatchEvent(
            new KeyboardEvent('keydown', { key: num, cancelable: true })
          )
        ).toBeTruthy();
      });
    });
  });
});
