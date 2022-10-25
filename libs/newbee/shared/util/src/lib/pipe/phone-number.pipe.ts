import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { Country } from '../class';

@Pipe({
  name: 'phoneNumber',
})
export class PhoneNumberPipe implements PipeTransform {
  private readonly phoneUtil = PhoneNumberUtil.getInstance();

  transform(
    value: string,
    country: Country | null = null,
    format = PhoneNumberFormat.NATIONAL
  ): string {
    try {
      const parsedNumber = this.phoneUtil.parse(value, country?.regionCode);
      return this.phoneUtil.format(parsedNumber, format);
    } catch (err) {
      return value;
    }
  }

  parse(value: string, country: Country | null = null): string {
    try {
      const parsedNumber = this.phoneUtil.parse(value, country?.regionCode);
      const nationalNumber = parsedNumber.getNationalNumber();
      return nationalNumber ? nationalNumber.toString() : '';
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
