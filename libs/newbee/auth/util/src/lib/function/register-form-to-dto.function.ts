import { BaseCreateUserDto } from '@newbee/shared/data-access';
import type { CountryCode } from 'libphonenumber-js';
import parsePhoneNumber from 'libphonenumber-js';
import type { RegisterForm } from '../interface';

/**
 * Converts a RegisterForm to a BaseCreateUserDto.
 *
 * @param registerForm The form to convert.
 *
 * @returns The form as a DTO.
 */
export function registerFormToDto(
  registerForm: RegisterForm | Partial<RegisterForm>
): BaseCreateUserDto {
  const { email, name, displayName, phoneNumber } = registerForm;

  let phoneNumberString: string | null = null;
  if (phoneNumber && phoneNumber.number && phoneNumber.country) {
    const { number, country } = phoneNumber;
    const parsedPhoneNumber = parsePhoneNumber(
      number,
      country.regionCode as CountryCode
    );
    phoneNumberString = parsedPhoneNumber?.format('E.164') ?? null;
  }

  return {
    email: email ?? '',
    name: name ?? '',
    displayName: displayName || null,
    phoneNumber: phoneNumberString,
  };
}
