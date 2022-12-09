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

/**
 * An example instance of BaseEmailDto.
 * Strictly for use in testing.
 */
export const testBaseEmailDto1: BaseEmailDto = {
  email: testUser1.email,
};

/**
 * An example instance of BaseLoginDto.
 * Strictly for use in testing.
 */
export const testBaseLoginDto1: BaseLoginDto = {
  access_token: 'access',
  user: testUser1,
};

/**
 * An example instance of BaseMagicLinkLoginDto.
 * Strictly for use in testing.
 */
export const testBaseMagicLinkLoginDto1: BaseMagicLinkLoginDto = {
  jwtId: '1234',
  email: testUser1.email,
};

/**
 * An example instance of BaseUserCreatedDto.
 * Strictly for use in testing.
 */
export const testBaseUserCreatedDto1: BaseUserCreatedDto = {
  ...testBaseLoginDto1,
  options: testPublicKeyCredentialCreationOptions1,
};

/**
 * An example instance of BaseWebAuthnLoginDto.
 * Strictly for use in testing.
 */
export const testBaseWebAuthnLoginDto1: BaseWebAuthnLoginDto = {
  email: testUser1.email,
  credential: testAuthenticationCredential1,
};

/**
 * An example instance of BaseCreateUserDto.
 * Strictly for use in testing.
 */
export const testBaseCreateUserDto1: BaseCreateUserDto = {
  email: testUser1.email,
  name: testUser1.name,
  displayName: testUser1.displayName,
  phoneNumber: testUser1.phoneNumber,
};

/**
 * An example instance of BaseUpdateUserDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateUserDto1: BaseUpdateUserDto = {
  email: testUser1.email,
  name: 'Jane Doe',
};
