import {
  testAuthenticator1,
  testUser1,
  testUserSettings1,
} from '@newbee/shared/util';
import { AuthenticatorEntity, UserEntity, UserSettingsEntity } from '../entity';

export const testAuthenticatorEntity1 = new AuthenticatorEntity(
  testAuthenticator1
);

export const testUserSettingsEntity1 = new UserSettingsEntity(
  testUserSettings1
);

export const testUserEntity1 = new UserEntity(testUser1);
