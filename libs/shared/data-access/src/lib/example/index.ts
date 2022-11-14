import {
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
};

export const testCreateUserDto1: BaseCreateUserDto = {
  email: testUser1.email,
  name: testUser1.name,
};

export const testUpdateUserDto1: BaseUpdateUserDto = {
  email: testUser1.email,
  name: 'Jane Doe',
};
