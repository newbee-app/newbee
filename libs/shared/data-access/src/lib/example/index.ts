import { NameDisplayFormat, testUser1 } from '@newbee/shared/util';
import {
  CreateUserDto,
  LoginDto,
  MagicLinkLoginDto,
  MagicLinkLoginLoginDto,
  UpdateUserDto,
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
  name: testUser1.name,
};

export const testUpdateUserDto1: UpdateUserDto = {
  email: testUser1.email,
  name: 'Jane Doe',
};

export const testUpdateUserSettingsDto1: UpdateUserSettingsDto = {
  nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
};
