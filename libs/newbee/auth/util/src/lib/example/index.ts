import { testUser1 } from '@newbee/shared/util';
import {
  MagicLinkLoginLoginForm,
  MagicLinkLoginRegisterForm,
} from '../interface';

const { email, name, displayName } = testUser1;

export const testMagicLinkLoginLoginForm1: MagicLinkLoginLoginForm = {
  email,
};

export const testMagicLinkLoginRegisterForm1: MagicLinkLoginRegisterForm = {
  email,
  name,
  ...(displayName ? { displayName } : {}),
};
