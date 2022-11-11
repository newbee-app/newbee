import {
  testAuthenticator1,
  testUser1,
  testUserChallenge1,
  testUserSettings1,
} from '@newbee/shared/util';
import {
  AuthenticatorEntity,
  UserChallengeEntity,
  UserEntity,
  UserSettingsEntity,
} from '../entity';

export const testAuthenticatorEntity1 = new AuthenticatorEntity(
  testAuthenticator1
);

export const testUserChallengeEntity1 = new UserChallengeEntity(
  testUserChallenge1
);

export const testUserSettingsEntity1 = new UserSettingsEntity(
  testUserSettings1
);

export const testUserEntity1 = new UserEntity(testUser1);
