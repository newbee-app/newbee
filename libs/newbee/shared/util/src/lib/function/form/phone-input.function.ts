import type { CountryCode } from 'libphonenumber-js';
import parsePhoneNumber from 'libphonenumber-js';
import { PhoneInput } from '../../interface';

/**
 * Convert a PhoneInput to a E.164 formatted phone number string.
 *
 * @param phoneInput The PhoneInput to convert.
 *
 * @returns The PhoneInput as a string.
 */
export function phoneInputToString(phoneInput: PhoneInput): string | null {
  let phoneNumberString: string | null = null;
  if (phoneInput && phoneInput.country && phoneInput.number) {
    const { country, number } = phoneInput;
    const parsedPhoneNumber = parsePhoneNumber(
      number,
      country.regionCode as CountryCode,
    );
    phoneNumberString = parsedPhoneNumber?.format('E.164') ?? null;
  }

  return phoneNumberString;
}
