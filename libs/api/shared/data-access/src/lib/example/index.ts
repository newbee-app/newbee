import { createMock } from '@golevelup/ts-jest';
import { Collection } from '@mikro-orm/core';
import { testBaseUserAndOptionsDto1 } from '@newbee/shared/data-access';
import {
  SolrEntryEnum,
  TeamRoleEnum,
  testAuthenticator1,
  testDoc1,
  testOrganization1,
  testOrgMember1,
  testQna1,
  testResponseHeader1,
  testSuggestion1,
  testTeam1,
  testUser1,
  testUserChallenge1,
  testUserSettings1,
} from '@newbee/shared/util';
import type {
  DocResponse,
  DocsResponse,
  QueryResponse,
} from '@newbee/solr-cli';
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
  id: '1',
  organizations: createMock<Collection<OrgMemberEntity>>(),
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
  user: testUserEntity1,
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
  id: 'org1',
  members: createMock<Collection<OrgMemberEntity>>(),
});

/**
 * An example instance of `TeamEntity`.
 * Strictly for use in testing.
 */
export const testTeamEntity1 = createMock<TeamEntity>({
  ...testTeam1,
  id: '1',
  organization: testOrganizationEntity1,
});

/**
 * An example instance of `OrgMemberEntity`.
 * Strictly for use in testing.
 */
export const testOrgMemberEntity1 = createMock<OrgMemberEntity>({
  ...testOrgMember1,
  user: testUserEntity1,
  organization: testOrganizationEntity1,
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
  id: '1',
  creator: testOrgMemberEntity1,
  maintainer: testOrgMemberEntity1,
  organization: testOrganizationEntity1,
  team: testTeamEntity1,
});

/**
 * An example instance of `QnaEntity`.
 * Strictly for use in testing.
 */
export const testQnaEntity1 = createMock<QnaEntity>({
  ...testQna1,
  id: '1',
  creator: testOrgMemberEntity1,
  maintainer: testOrgMemberEntity1,
  organization: testOrganizationEntity1,
  team: testTeamEntity1,
});

/**
 * An example instance of `DocResponse`.
 * Strictly for use in testing.
 */
export const testDocResponse1: DocResponse = {
  id: testTeamEntity1.id,
  _version_: BigInt(1),
  type: SolrEntryEnum.Team,
  slug: testTeamEntity1.slug,
  team_name: testTeamEntity1.name,
};

/**
 * An example instance of `DocsResponse`.
 * Strictly for use in testing.
 */
export const testDocsResponse1: DocsResponse = {
  numFound: 1,
  start: 0,
  numFoundExact: true,
  docs: [testDocResponse1],
};

/**
 * An example instance of `DocsResponse`.
 * Strictly for use in testing.
 */
export const testDocsResponse2: DocsResponse = {
  numFound: 0,
  start: 0,
  numFoundExact: true,
  docs: [],
};

/**
 * An example instance of `QueryResponse`.
 * Strictly for use in testing.
 */
export const testQueryResponse1: QueryResponse = {
  responseHeader: testResponseHeader1,
  response: testDocsResponse1,
};

/**
 * An example instance of `QueryResponse`.
 * Strictly for use in testing.
 */
export const testQueryResponse2: QueryResponse = {
  responseHeader: testResponseHeader1,
  response: testDocsResponse2,
  suggest: {
    default: { query: { numFound: 1, suggestions: [testSuggestion1] } },
  },
};

/**
 * An example instance of `QueryResponse`.
 * Strictly for use in testing.
 */
export const testSuggestResponse1: QueryResponse = {
  responseHeader: testResponseHeader1,
  response: testDocsResponse2,
  suggest: {
    default: {
      query: {
        numFound: 1,
        suggestions: [testSuggestion1],
      },
    },
  },
};
