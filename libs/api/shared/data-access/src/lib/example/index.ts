import { testBaseUserAndOptionsDto1 } from '@newbee/shared/data-access';
import {
  testAuthenticator1,
  testOrganization1,
  testUser1,
  testUserChallenge1,
} from '@newbee/shared/util';
import { UserAndOptionsDto } from '../dto';
import {
  AuthenticatorEntity,
  OrganizationEntity,
  // OrganizationEntity,
  UserEntity,
} from '../entity';

/**
 * An example instance of `UserEntity`.
 * Strictly for use in testing.
 */
export const testUserEntity1 = new UserEntity(
  testUser1.id,
  testUser1.email,
  testUser1.name,
  testUser1.displayName,
  testUser1.phoneNumber,
  testUserChallenge1.challenge ?? 'challenge1'
);

/**
 * An example instance of `AuthenticatorEntity`.
 * Strictly for use in testing.
 */
export const testAuthenticatorEntity1 = new AuthenticatorEntity(
  testAuthenticator1.credentialId,
  testAuthenticator1.credentialPublicKey,
  testAuthenticator1.counter,
  testAuthenticator1.credentialDeviceType,
  testAuthenticator1.credentialBackedUp,
  testUserEntity1
);

/**
 * An example instance of `UserChallengeEntity`.
 * Strictly for use in testing.
 */
export const testUserChallengeEntity1 = testUserEntity1.challenge;

/**
 * An example instance of `UserSettingsEntity`.
 * Strictly for use in testing.
 */
export const testUserSettingsEntity1 = testUserEntity1.settings;

/**
 * An example instance of `UserAndOptionsDto`.
 * Strictly for use in testing.
 */
export const testUserAndOptionsDto1: UserAndOptionsDto = {
  ...testBaseUserAndOptionsDto1,
  user: testUserEntity1,
};

/**
 * An example instance of `OrganizationEntity`.
 * Strictly for use in testing.
 */
export const testOrganizationEntity1 = new OrganizationEntity(
  testOrganization1.name,
  testUserEntity1,
  {
    ...(testOrganization1.displayName && {
      displayName: testOrganization1.displayName,
    }),
  }
);
