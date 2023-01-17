import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import { Country } from '../class';
import { PhoneNumberPipe, PhoneNumberPipeModule } from '../pipe';
import { DigitOnlyDirective } from './digit-only.directive';

/**
 * A directive to be used with a string input representing a phone number.
 * Prevents users from inputting or pasting non-number values.
 * When the user focuses on the input, the phone number will be displayed as a plain string.
 * When the user blurs the input, the phone number will be displayed as a formatted string.
 */
@Directive({
  selector: '[newbeePhoneNumberInput]',
})
export class PhoneNumberInputDirective
  extends DigitOnlyDirective
  implements OnInit
{
  /**
   * The country associated with the phone number.
   */
  @Input() country: Country | null = null;

  /**
   * Listens for a `focus` event on the element and converts the phone number input to a plain string.
   *
   * @param value The formatted phone number string.
   */
  @HostListener('focus', ['$event.target.value'])
  focusEvent(value: string) {
    this.inputElement.value = this.phoneNumberPipe.parse(value, this.country);
  }

  /**
   * Listens for a `blur` event on the element and converts the phone number input to a formatted string.
   *
   * @param value The plain phone number string.
   */
  @HostListener('blur', ['$event.target.value'])
  blurEvent(value: string) {
    this.inputElement.value = this.phoneNumberPipe.transform(
      value,
      this.country
    );
  }

  constructor(
    private readonly phoneNumberPipe: PhoneNumberPipe,
    elementRef: ElementRef<HTMLInputElement>
  ) {
    super(elementRef);
  }

  ngOnInit(): void {
    this.inputElement.value = this.phoneNumberPipe.transform(
      this.inputElement.value,
      this.country
    );
  }
}

@NgModule({
  imports: [PhoneNumberPipeModule],
  declarations: [PhoneNumberInputDirective],
  exports: [PhoneNumberInputDirective],
})
export class PhoneNumberInputDirectiveModule {}
