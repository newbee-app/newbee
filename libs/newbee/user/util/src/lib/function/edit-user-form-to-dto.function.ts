import { phoneInputToString } from '@newbee/newbee/shared/util';
import { BaseUpdateUserDto } from '@newbee/shared/util';
import type { EditUserForm } from '../interface';

/**
 * Converts an EditUserForm to a BaseUpdateUserDto.
 *
 * @param editUserForm The form to convert.
 *
 * @returns The form as a DTO.
 */
export function editUserFormToDto(
  editUserForm: EditUserForm | Partial<EditUserForm>,
): BaseUpdateUserDto {
  const { name, displayName, phoneNumber } = editUserForm;
  const phoneNumberString = phoneNumber
    ? phoneInputToString(phoneNumber)
    : null;

  return {
    ...(name && { name }),
    displayName: displayName || null,
    phoneNumber: phoneNumberString,
  };
}
