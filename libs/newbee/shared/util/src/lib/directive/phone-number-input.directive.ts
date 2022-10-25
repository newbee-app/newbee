import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import { DigitOnlyDirective } from '@uiowa/digit-only';
import { Country } from '../class';
import { PhoneNumberPipe, PhoneNumberPipeModule } from '../pipe';

@Directive({
  selector: '[newbeePhoneNumberInput]',
})
export class PhoneNumberInputDirective
  extends DigitOnlyDirective
  implements OnInit
{
  @Input() country: Country | null = null;

  @HostListener('focus', ['$event.target.value']) focusEvent(value: string) {
    this.inputElement.value = this.phoneNumberPipe.parse(value, this.country);
  }
  @HostListener('blur', ['$event.target.value']) blurEvent(value: string) {
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
