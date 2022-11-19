import { testUser1 } from '@newbee/shared/util';
import { LoginForm, RegisterForm } from '../interface';

const { email, name, displayName } = testUser1;

export const testLoginForm1: LoginForm = { email };

export const testRegisterForm1: RegisterForm = {
  email,
  name,
  ...(displayName ? { displayName } : {}),
};
