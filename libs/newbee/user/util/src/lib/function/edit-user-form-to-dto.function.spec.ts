import { testPhoneInput1 } from '@newbee/newbee/shared/util';
import { testUser1 } from '@newbee/shared/util';
import { editUserFormToDto } from './edit-user-form-to-dto.function';

describe('editUserFormToDto', () => {
  it('should convert an edit user form to a DTO', () => {
    expect(editUserFormToDto({})).toEqual({
      displayName: null,
      phoneNumber: null,
    });
    expect(editUserFormToDto({ name: testUser1.name })).toEqual({
      name: testUser1.name,
      displayName: null,
      phoneNumber: null,
    });
    expect(
      editUserFormToDto({
        name: '',
        displayName: testUser1.displayName,
        phoneNumber: testPhoneInput1,
      })
    ).toEqual({
      displayName: testUser1.displayName,
      phoneNumber: testUser1.phoneNumber,
    });
  });
});
