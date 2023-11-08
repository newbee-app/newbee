import { testBaseEmailDto1 } from '@newbee/shared/util';
import { testLoginForm1 } from '../example';
import { loginFormToDto } from './login-form-to-dto.function';

describe('loginFormToDto', () => {
  it('should convert a login form to a DTO', () => {
    expect(loginFormToDto({})).toEqual({ email: '' });
    expect(loginFormToDto({ email: null })).toEqual({ email: '' });
    expect(loginFormToDto(testLoginForm1)).toEqual(testBaseEmailDto1);
  });
});
