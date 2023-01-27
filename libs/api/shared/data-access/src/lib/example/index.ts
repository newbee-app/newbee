import { testBaseUserAndOptionsDto1 } from '@newbee/shared/data-access';
import {
  testAuthenticator1,
  testDoc1,
  testOrganization1,
  testQna1,
  testTeam1,
  testUser1,
  testUserChallenge1,
  testUserSettings1,
} from '@newbee/shared/util';
import { UserAndOptionsDto } from '../dto';
import {
  AuthenticatorEntity,
  DocEntity,
  OrganizationEntity,
  QnaEntity,
  TeamEntity,
  UserChallengeEntity,
  UserEntity,
  UserOrganizationEntity,
  UserSettingsEntity,
} from '../entity';

/**
 * An example instance of `UserEntity`.
 * Strictly for use in testing.
 */
export const testUserEntity1 = testUser1 as UserEntity;

/**
 * An example instance of `AuthenticatorEntity`.
 * Strictly for use in testing.
 */
export const testAuthenticatorEntity1 =
  testAuthenticator1 as AuthenticatorEntity;

/**
 * An example instance of `UserChallengeEntity`.
 * Strictly for use in testing.
 */
export const testUserChallengeEntity1 =
  testUserChallenge1 as UserChallengeEntity;
testUserChallengeEntity1.user = testUserEntity1;

/**
 * An example instance of `UserSettingsEntity`.
 * Strictly for use in testing.
 */
export const testUserSettingsEntity1 = testUserSettings1 as UserSettingsEntity;

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
export const testOrganizationEntity1 = testOrganization1 as OrganizationEntity;

/**
 * An example instance of `TeamEntity`.
 * Strictly for use in testing.
 */
export const testTeamEntity1 = testTeam1 as TeamEntity;

/**
 * An example instance of `UserOrganizationEntity`.
 * Strictly for use in testing.
 */
export const testUserOrganizationEntity1 = {
  user: testUserEntity1,
  organization: testOrganizationEntity1,
} as UserOrganizationEntity;

/**
 * An example instance of `DocEntity`.
 * Strictly for use in testing.
 */
export const testDocEntity1 = testDoc1 as DocEntity;

/**
 * An example instance of `QnaEntity`.
 * Strictly for use in testing.
 */
export const testQnaEntity1 = testQna1 as QnaEntity;
