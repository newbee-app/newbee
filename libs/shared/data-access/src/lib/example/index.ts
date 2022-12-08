import {
  testAuthenticationCredential1,
  testPublicKeyCredentialCreationOptions1,
  testUser1,
} from '@newbee/shared/util';
import {
  BaseCreateUserDto,
  BaseEmailDto,
  BaseLoginDto,
  BaseMagicLinkLoginDto,
  BaseUpdateUserDto,
  BaseUserCreatedDto,
  BaseWebAuthnLoginDto,
} from '../dto';

export const testBaseEmailDto1: BaseEmailDto = {
  email: testUser1.email,
};

export const testBaseLoginDto1: BaseLoginDto = {
  access_token: 'access',
  user: testUser1,
};

export const testBaseMagicLinkLoginDto1: BaseMagicLinkLoginDto = {
  jwtId: '1234',
  email: testUser1.email,
};

export const testBaseUserCreatedDto1: BaseUserCreatedDto = {
  ...testBaseLoginDto1,
  options: testPublicKeyCredentialCreationOptions1,
};

export const testBaseWebAuthnLoginDto1: BaseWebAuthnLoginDto = {
  email: testUser1.email,
  credential: testAuthenticationCredential1,
};

export const testBaseCreateUserDto1: BaseCreateUserDto = {
  email: testUser1.email,
  name: testUser1.name,
  displayName: testUser1.displayName,
  phoneNumber: testUser1.phoneNumber,
};

export const testBaseUpdateUserDto1: BaseUpdateUserDto = {
  email: testUser1.email,
  name: 'Jane Doe',
};
