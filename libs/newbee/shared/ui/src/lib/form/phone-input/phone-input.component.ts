import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Country,
  CountryService,
  SelectOption,
} from '@newbee/newbee/shared/util';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { SearchableSelectModule } from '../searchable-select/searchable-select.component';

@Component({
  selector: 'newbee-phone-input',
  templateUrl: './phone-input.component.html',
})
export class PhoneInputComponent {
  @Output() phoneNumber = new EventEmitter<string>();

  phoneNumberControl = new FormControl('');

  readonly countryOptions: SelectOption[] =
    this.countryService.supportedPhoneRegions
      .map((region) => this.countryService.getCountry(region))
      .map(
        (country) =>
          new SelectOption(
            country.regionCode,
            `${country.name} (+${country.dialingCode})`,
            `${country.regionCode} (+${country.dialingCode})`
          )
      );
  private _selectedCountry: Country | null = null;
  private readonly phoneUtil = PhoneNumberUtil.getInstance();

  constructor(private readonly countryService: CountryService) {
    this.phoneNumberControl.valueChanges.subscribe({
      next: (val) => {
        this.emitPhoneNumber(val);
      },
    });
  }

  get selectedCountry(): Country | null {
    return this._selectedCountry;
  }

  get defaultCountry(): string {
    return this.countryService.currentCountry.regionCode;
  }

  private emitPhoneNumber(value: string | null): void {
    if (!value) {
      return;
    }

    const parsedPhoneNumber = this.phoneUtil.parse(
      value,
      this._selectedCountry?.regionCode
    );

    const toControl = this.phoneUtil.format(
      parsedPhoneNumber,
      PhoneNumberFormat.NATIONAL
    );
    // emitEvent false is critical to avoid an infinite emit loop
    this.phoneNumberControl.setValue(toControl, { emitEvent: false });

    const toEmit = this.phoneUtil.format(
      parsedPhoneNumber,
      PhoneNumberFormat.E164
    );
    this.phoneNumber.emit(toEmit);
  }

  selectCountry(regionCode: string): void {
    this._selectedCountry = this.countryService.getCountry(regionCode);
    this.emitPhoneNumber(this.phoneNumberControl.value);
  }
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SearchableSelectModule],
  declarations: [PhoneInputComponent],
  exports: [PhoneInputComponent],
})
export class PhoneInputModule {}
