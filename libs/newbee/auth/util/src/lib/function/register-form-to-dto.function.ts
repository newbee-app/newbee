import { phoneInputToString } from '@newbee/newbee/shared/util';
import { BaseCreateUserDto } from '@newbee/shared/util';
import type { RegisterForm } from '../interface';

/**
 * Converts a RegisterForm to a BaseCreateUserDto.
 *
 * @param registerForm The form to convert.
 *
 * @returns The form as a DTO.
 */
export function registerFormToDto(
  registerForm: RegisterForm | Partial<RegisterForm>,
): BaseCreateUserDto {
  const { email, name, displayName, phoneNumber } = registerForm;
  const phoneNumberString = phoneNumber
    ? phoneInputToString(phoneNumber)
    : null;
  return {
    email: email ?? '',
    name: name ?? '',
    displayName: displayName || null,
    phoneNumber: phoneNumberString,
  };
}
