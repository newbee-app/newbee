import { createMock } from '@golevelup/ts-jest';
import { OrgRoleEnum, TeamRoleEnum } from '@newbee/api/shared/util';
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
  OrgMemberEntity,
  QnaEntity,
  TeamEntity,
  UserChallengeEntity,
  UserEntity,
  UserSettingsEntity,
} from '../entity';
import { TeamMemberEntity } from '../entity/team-member.entity';

/**
 * An example instance of `UserEntity`.
 * Strictly for use in testing.
 */
export const testUserEntity1 = createMock<UserEntity>({
  ...testUser1,
});

/**
 * An example instance of `AuthenticatorEntity`.
 * Strictly for use in testing.
 */
export const testAuthenticatorEntity1 = createMock<AuthenticatorEntity>({
  ...testAuthenticator1,
});

/**
 * An example instance of `UserChallengeEntity`.
 * Strictly for use in testing.
 */
export const testUserChallengeEntity1 = createMock<UserChallengeEntity>({
  ...testUserChallenge1,
  user: testUserEntity1,
});

/**
 * An example instance of `UserSettingsEntity`.
 * Strictly for use in testing.
 */
export const testUserSettingsEntity1 = createMock<UserSettingsEntity>({
  ...testUserSettings1,
});

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
export const testOrganizationEntity1 = createMock<OrganizationEntity>({
  ...testOrganization1,
});

/**
 * An example instance of `TeamEntity`.
 * Strictly for use in testing.
 */
export const testTeamEntity1 = createMock<TeamEntity>({ ...testTeam1 });

/**
 * An example instance of `OrgMemberEntity`.
 * Strictly for use in testing.
 */
export const testOrgMemberEntity1 = createMock<OrgMemberEntity>({
  user: testUserEntity1,
  organization: testOrganizationEntity1,
  role: OrgRoleEnum.Owner,
});

/**
 * An example instance of `TeamMemberEntity`.
 * Strictly for use in testing.
 */
export const testTeamMemberEntity1 = createMock<TeamMemberEntity>({
  orgMember: testOrgMemberEntity1,
  team: testTeamEntity1,
  role: TeamRoleEnum.Owner,
});

/**
 * An example instance of `DocEntity`.
 * Strictly for use in testing.
 */
export const testDocEntity1 = createMock<DocEntity>({
  ...testDoc1,
  creator: testOrgMemberEntity1,
  maintainer: testOrgMemberEntity1,
});

/**
 * An example instance of `QnaEntity`.
 * Strictly for use in testing.
 */
export const testQnaEntity1 = createMock<QnaEntity>({
  ...testQna1,
  creator: testOrgMemberEntity1,
  maintainer: testOrgMemberEntity1,
});
