import { NameDisplayFormat, testUser1 } from '@newbee/shared/util';
import {
  CreateUserDto,
  LoginDto,
  MagicLinkLoginDto,
  MagicLinkLoginLoginDto,
  UpdateUserSettingsDto,
} from '../dto';

export const testLoginDto1: LoginDto = {
  access_token: 'access',
  user: testUser1,
};

export const testMagicLinkLoginLoginDto1: MagicLinkLoginLoginDto = {
  email: testUser1.email,
};

export const testMagicLinkLoginDto1: MagicLinkLoginDto = {
  jwtId: '1234',
};

export const testCreateUserDto1: CreateUserDto = {
  email: testUser1.email,
  firstName: testUser1.firstName,
  lastName: testUser1.lastName,
};

export const testUpdateUserSettingsDto1: UpdateUserSettingsDto = {
  nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
};
