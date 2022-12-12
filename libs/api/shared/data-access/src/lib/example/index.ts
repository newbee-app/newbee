import {
  testAuthenticator1,
  testUser1,
  testUserChallenge1,
} from '@newbee/shared/util';
import {
  AuthenticatorEntity,
  UserChallengeEntity,
  UserEntity,
  UserSettingsEntity,
} from '../entity';

/**
 * An example instance of `AuthenticatorEntity`.
 * Strictly for use in testing.
 */
export const testAuthenticatorEntity1 = new AuthenticatorEntity(
  testAuthenticator1
);

/**
 * An example instance of `UserEntity`.
 * Strictly for use in testing.
 */
export const testUserEntity1 = new UserEntity(testUser1);

/**
 * An example instance of `UserChallengeEntity`.
 * Strictly for use in testing.
 */
export const testUserChallengeEntity1 = new UserChallengeEntity({
  challenge: testUserChallenge1.challenge,
  user: testUserEntity1,
});

/**
 * An example instance of `UserSettingsEntity`.
 * Strictly for use in testing.
 */
export const testUserSettingsEntity1 = new UserSettingsEntity({
  user: testUserEntity1,
});
