import { NgModule, Pipe, PipeTransform } from '@angular/core';
import type { CountryCode, NumberFormat } from 'libphonenumber-js';
import { parsePhoneNumber } from 'libphonenumber-js';
import { Country } from '../class';

/**
 * A pipe for formatting phone number strings.
 */
@Pipe({
  name: 'phoneNumber',
})
export class PhoneNumberPipe implements PipeTransform {
  /**
   * Trasnform a plain phone number string into a formatted phone number string.
   *
   * @param value The plain phone number string.
   * @param country The country the phone number belongs to.
   * @param format The phone number format that should be used.
   *
   * @returns The formatted phone number string.
   */
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

  /**
   * Transform a formatted phone number string to a plain phone number string.
   *
   * @param value The formatted phone number string.
   * @param country The country the phone number belongs to.
   *
   * @returns The plain phone number string.
   */
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
