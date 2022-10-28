import { NgModule, Pipe, PipeTransform } from '@angular/core';
import type { CountryCode, NumberFormat } from 'libphonenumber-js';
import { parsePhoneNumber } from 'libphonenumber-js';
import { Country } from '../class';

@Pipe({
  name: 'phoneNumber',
})
export class PhoneNumberPipe implements PipeTransform {
  transform(
    value: string,
    country: Country | null = null,
    format: NumberFormat = 'NATIONAL'
  ): string {
    try {
      const parsedNumber = parsePhoneNumber(
        value,
        country?.regionCode as CountryCode
      );
      return parsedNumber.format(format);
    } catch (err) {
      return value;
    }
  }

  parse(value: string, country: Country | null = null): string {
    try {
      const parsedNumber = parsePhoneNumber(
        value,
        country?.regionCode as CountryCode
      );
      const nationalNumber = parsedNumber.nationalNumber;
      return nationalNumber ?? value;
    } catch (err) {
      return value;
    }
  }
}

@NgModule({
  providers: [PhoneNumberPipe],
  declarations: [PhoneNumberPipe],
  exports: [PhoneNumberPipe],
})
export class PhoneNumberPipeModule {}
