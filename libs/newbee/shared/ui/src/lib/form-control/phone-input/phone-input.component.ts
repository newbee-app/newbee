import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import type {
  ControlValueAccessor,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
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
import { Subject, takeUntil } from 'rxjs';
import { ErrorFooterComponent } from '../../error-footer/error-footer.component';
import { SearchableSelectComponent } from '../searchable-select/searchable-select.component';

/**
 * A custom phone input component.
 * Fully compatible with Angular's form controls.
 * Provides additional features like:
 *
 * - Preventing users from inputting or pasting non-number values.
 * - Including a dropdown to select the phone number's country code.
 * - Auto-formatting of the phone number.
 * - Phone number validation.
 */
@Component({
  selector: 'newbee-phone-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchableSelectComponent,
    PhoneNumberInputDirectiveModule,
    PhoneNumberPipeModule,
    ErrorFooterComponent,
  ],
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
  /**
   * The internal form group representing a phone number.
   * Includes a country and a phone number string.
   */
  phoneNumber = this.fb.group(
    {
      country: new FormControl<Country | null>(null),
      number: [''],
    },
    { validators: [phoneNumberValidator()] }
  );

  /**
   * All of the possible phone number countries, represented as `SelectOption`s.
   */
  readonly countryOptions: SelectOption<Country>[] =
    this.countryService.supportedPhoneCountries.map(
      (country) =>
        new SelectOption(
          country,
          `${country.name} (+${country.dialingCode})`,
          `${country.regionCode} (+${country.dialingCode})`
        )
    );

  /**
   * A Subject to unsubscribe from the component's infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Whether the control is dirty.
   */
  private _dirty = false;

  /**
   * Whether the control has been touched.
   */
  private _touched = false;

  /**
   * Called to trigger change detection.
   * @param _ The new value.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange: (_: Partial<PhoneInput>) => void = (_) => {
    this._dirty = true;
  };

  /**
   * Called to mark the control as touched.
   */
  private _onTouched: () => void = () => {
    this._touched = true;
  };

  constructor(
    private readonly countryService: CountryService,
    private readonly fb: FormBuilder,
    private readonly phoneNumberPipe: PhoneNumberPipe
  ) {
    this.phoneNumber.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (val) => {
        this._onChange(val);
      },
    });
  }

  /**
   * Unsubscribes from the component's infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Sets the control's internal phone number form group value.
   * Does not trigger change detection.
   *
   * @param val The new value for the internal phone number form group.
   */
  writeValue(val: Partial<PhoneInput>): void {
    this.phoneNumber.patchValue(val, { emitEvent: false });
  }

  /**
   * Registers the `_onChange` function.
   * Makes sure that `_onChange` marks the control as dirty.
   *
   * @param fn The function to assign.
   */
  registerOnChange(fn: (_: Partial<PhoneInput>) => void): void {
    this._onChange = (val) => {
      this._dirty = true;
      fn(val);
    };
  }

  /**
   * Registers the `_onTouched` function.
   * Makes sure that `_onTouched` marks the control as touched.
   *
   * @param fn The function to assign.
   */
  registerOnTouched(fn: () => void): void {
    this._onTouched = () => {
      this._touched = true;
      fn();
    };
  }

  /**
   * Disables or enables the control.
   * Does so by disabling/enabling the internal form group.
   *
   * @param isDisabled Whether to disable the form control.
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.phoneNumber.disable();
    } else {
      this.phoneNumber.enable();
    }
  }

  /**
   * Whether the control is valid.
   *
   * @param _ The control to validate. Not necessary in this case because it's being used in the control itself.
   *
   * @returns `null` if the control is valid, a validation error object if it's not.
   */
  validate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: AbstractControl<Partial<PhoneInput>>
  ): ValidationErrors | null {
    return this.phoneNumber.errors;
  }

  /**
   * The value of the control.
   */
  get value(): Partial<PhoneInput> {
    return this.phoneNumber.value;
  }

  /**
   * Whether the control is clean, defined as being not dirty and not touched.
   */
  get clean(): boolean {
    return !this._dirty && !this._touched;
  }

  /**
   * Called to trigger change detection.
   */
  get onChange(): (_: Partial<PhoneInput>) => void {
    return this._onChange;
  }

  /**
   * Called to mark the control as touched.
   */
  get onTouched(): () => void {
    return this._onTouched;
  }

  /**
   * Gets the error message for the control, if one exists.
   */
  get errorMessage(): string {
    return getErrorMessage(this.phoneNumber);
  }

  /**
   * Whether the control has an error for the given input.
   *
   * @param inputName Whether to look for errors related to the `country` or `number` portion of the control.
   *
   * @returns `true` if an error exists for the input, `false` if not.
   */
  hasError(inputName: 'country' | 'number'): boolean {
    const phoneNumberError = this.phoneNumber.getError('phoneNumber');
    if (!phoneNumberError) {
      return false;
    }

    if (
      inputName === 'country' &&
      (phoneNumberError.missingCountry || phoneNumberError.invalidCountry)
    ) {
      return true;
    } else if (
      inputName === 'number' &&
      (phoneNumberError.invalid || phoneNumberError.invalidNumber)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Formats the phone number string in the control.
   */
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
