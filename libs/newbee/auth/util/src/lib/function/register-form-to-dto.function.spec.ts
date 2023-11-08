import { testBaseCreateUserDto1 } from '@newbee/shared/util';
import { testRegisterForm1 } from '../example';
import { registerFormToDto } from './register-form-to-dto.function';

describe('registerFormToDto', () => {
  it('should convert a register form to a DTO', () => {
    expect(registerFormToDto({})).toEqual({
      email: '',
      name: '',
      displayName: null,
      phoneNumber: null,
    });
    expect(
      registerFormToDto({
        email: null,
        name: null,
        displayName: null,
        phoneNumber: null,
      }),
    ).toEqual({ email: '', name: '', displayName: null, phoneNumber: null });
    expect(
      registerFormToDto({
        email: '',
        name: '',
        displayName: '',
        phoneNumber: { country: null, number: null },
      }),
    ).toEqual({ email: '', name: '', displayName: null, phoneNumber: null });
    expect(registerFormToDto(testRegisterForm1)).toEqual(
      testBaseCreateUserDto1,
    );
  });
});
