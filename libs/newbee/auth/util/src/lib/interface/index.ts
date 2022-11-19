import { PhoneInput } from '@newbee/newbee/shared/util';

export interface LoginForm {
  email: string | null;
}

export interface RegisterForm {
  email: string | null;
  name: string | null;
  displayName?: string | null;
  phoneNumber?: PhoneInput | null;
}
