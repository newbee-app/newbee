/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {
  Country,
  CountryService,
  getErrorMessage,
  PhoneInput,
  PhoneNumberInputDirectiveModule,
  PhoneNumberPipe,
  PhoneNumberPipeModule,
  phoneNumberValidator,
  SelectOption,
} from '@newbee/newbee/shared/util';
import { Subscription } from 'rxjs';
import { TooltipComponentModule } from '../../tooltip/tooltip.component';
import { SearchableSelectComponentModule } from '../searchable-select/searchable-select.component';

@Component({
  selector: 'newbee-phone-input',
  templateUrl: './phone-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: PhoneInputComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: PhoneInputComponent,
    },
  ],
})
export class PhoneInputComponent
  implements OnDestroy, ControlValueAccessor, Validator
{
  phoneNumber = this.fb.group(
    {
      country: new FormControl<Country | null>(null),
      number: [''],
    },
    { validators: [phoneNumberValidator()] }
  );

  readonly countryOptions: SelectOption<Country>[] =
    this.countryService.supportedPhoneCountries.map(
      (country) =>
        new SelectOption(
          country,
          `${country.name} (+${country.dialingCode})`,
          `${country.regionCode} (+${country.dialingCode})`
        )
    );
  readonly tooltipIds = {
    country: {
      container: 'country-container',
      tooltip: 'country-tooltip',
      message: 'country-message',
      tail: 'country-tail',
    },
    number: {
      container: 'number-container',
      tooltip: 'number-tooltip',
      message: 'number-message',
      tail: 'number-tail',
    },
  };

  private phoneNumberSubscription: Subscription;
  private _dirty = false;
  private _touched = false;
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange: (_: Partial<PhoneInput>) => void = (_) => {
    this._dirty = true;
  };
  // @ts-ignore
  private _onTouched: () => void = () => {
    this._touched = true;
  };

  constructor(
    private readonly countryService: CountryService,
    private readonly fb: FormBuilder,
    private readonly phoneNumberPipe: PhoneNumberPipe
  ) {
    this.phoneNumberSubscription = this.phoneNumber.valueChanges.subscribe({
      next: (val) => {
        this._onChange(val);
      },
    });
  }

  ngOnDestroy(): void {
    this.phoneNumberSubscription.unsubscribe();
  }

  writeValue(val: Partial<PhoneInput>): void {
    this.phoneNumber.patchValue(val, { emitEvent: false });
  }

  registerOnChange(fn: (_: Partial<PhoneInput>) => void): void {
    this._onChange = (val) => {
      this._dirty = true;
      fn(val);
    };
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = () => {
      this._touched = true;
      fn();
    };
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.phoneNumber.disable();
    } else {
      this.phoneNumber.enable();
    }
  }

  validate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: AbstractControl<Partial<PhoneInput>>
  ): ValidationErrors | null {
    return this.phoneNumber.errors;
  }

  get value(): Partial<PhoneInput> {
    return this.phoneNumber.value;
  }

  get clean(): boolean {
    return !this._dirty && !this._touched;
  }

  get onChange(): (_: Partial<PhoneInput>) => void {
    return this._onChange;
  }

  get onTouched(): () => void {
    return this._onTouched;
  }

  get errorMessage(): string {
    return getErrorMessage(this.phoneNumber);
  }

  hasError(inputName: 'country' | 'number'): boolean {
    const phoneNumberError = this.phoneNumber.getError('phoneNumber');
    if (!phoneNumberError) {
      return false;
    }

    if (inputName === 'country' && phoneNumberError.missingCountry) {
      return true;
    } else if (
      inputName === 'number' &&
      (phoneNumberError.invalid || phoneNumberError.invalidNumber)
    ) {
      return true;
    }

    return false;
  }

  formatNumber(): void {
    const { country, number } = this.phoneNumber.value;
    if (!country || !number) {
      return;
    }

    const parsedNumber = this.phoneNumberPipe.parse(number, country);
    const formattedNumber = this.phoneNumberPipe.transform(
      parsedNumber,
      country
    );
    this.writeValue({ number: formattedNumber });
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchableSelectComponentModule,
    TooltipComponentModule,
    PhoneNumberInputDirectiveModule,
    PhoneNumberPipeModule,
  ],
  declarations: [PhoneInputComponent],
  exports: [PhoneInputComponent],
})
export class PhoneInputComponentModule {}
