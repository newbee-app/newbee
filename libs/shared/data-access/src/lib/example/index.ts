import { NameDisplayFormat, testUser1 } from '@newbee/shared/util';
import {
  BaseCreateUserDto,
  BaseLoginDto,
  BaseMagicLinkLoginDto,
  BaseMagicLinkLoginLoginDto,
  BaseUpdateUserDto,
  BaseUpdateUserSettingsDto,
} from '../dto';

export const testLoginDto1: BaseLoginDto = {
  access_token: 'access',
  user: testUser1,
};

export const testMagicLinkLoginLoginDto1: BaseMagicLinkLoginLoginDto = {
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

export const testUpdateUserSettingsDto1: BaseUpdateUserSettingsDto = {
  nameDisplayFormat: NameDisplayFormat.FIRST_LAST,
};
