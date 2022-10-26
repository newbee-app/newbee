import { PhoneInput } from '@newbee/newbee/shared/util';

export interface MagicLinkLoginLoginForm {
  email: string | null;
}

export interface MagicLinkLoginRegisterForm {
  email: string | null;
  name: string | null;
  displayName?: string | null;
  phoneNumber?: PhoneInput | null;
}
