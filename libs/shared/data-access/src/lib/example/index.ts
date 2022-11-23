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

export const testLoginDto1: BaseLoginDto = {
  access_token: 'access',
  user: testUser1,
};

export const testUserCreatedDto1: BaseUserCreatedDto = {
  ...testLoginDto1,
  options: testPublicKeyCredentialCreationOptions1,
};

export const testEmailDto1: BaseEmailDto = {
  email: testUser1.email,
};

export const testMagicLinkLoginDto1: BaseMagicLinkLoginDto = {
  jwtId: '1234',
  email: testUser1.email,
};

export const testCreateUserDto1: BaseCreateUserDto = {
  email: testUser1.email,
  name: testUser1.name,
  ...(testUser1.displayName && { displayName: testUser1.displayName }),
  ...(testUser1.phoneNumber && { phoneNumber: testUser1.phoneNumber }),
};

export const testUpdateUserDto1: BaseUpdateUserDto = {
  email: testUser1.email,
  name: 'Jane Doe',
};

export const testWebAuthnLoginDto1: BaseWebAuthnLoginDto = {
  email: testUser1.email,
  credential: testAuthenticationCredential1,
};
