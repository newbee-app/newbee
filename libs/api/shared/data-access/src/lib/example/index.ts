import { createMock } from '@golevelup/ts-jest';
import { Collection } from '@mikro-orm/core';
import {
  DocDocParams,
  OrgMemberDocParams,
  QnaDocParams,
  TeamDocParams,
} from '@newbee/api/shared/util';
import { testBaseUserAndOptionsDto1 } from '@newbee/shared/data-access';
import {
  SolrEntryEnum,
  TeamRoleEnum,
  testAuthenticator1,
  testDoc1,
  testOrganization1,
  testOrgMember1,
  testQna1,
  testTeam1,
  testUser1,
  testUserChallenge1,
  testUserSettings1,
} from '@newbee/shared/util';
import type {
  DocResponse,
  DocsResponse,
  QueryResponse,
  ResponseHeader,
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
  id: `${testUserEntity1.id},${testOrganizationEntity1.id}`,
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
  docTxt: 'docTxt',
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
  questionTxt: 'questionTxt',
  answerTxt: 'answerTxt',
  creator: testOrgMemberEntity1,
  maintainer: testOrgMemberEntity1,
  organization: testOrganizationEntity1,
  team: testTeamEntity1,
});

/**
 * An example instance of `OrgMemberDocParams`.
 * Strictly for use in testing.
 */
export const testOrgMemberDocParams1 = new OrgMemberDocParams(
  testOrgMemberEntity1.id,
  testOrgMemberEntity1.slug,
  testUserEntity1.name,
  testUserEntity1.displayName
);

/**
 * An example instance of `TeamDocParams`.
 * Strictly for use in testing.
 */
export const testTeamDocParams1 = new TeamDocParams(
  testTeamEntity1.id,
  testTeamEntity1.slug,
  testTeamEntity1.name
);

/**
 * An example instance of `DocDocParams`.
 * Strictly for use in testing.
 */
export const testDocDocParams1 = new DocDocParams(
  testDocEntity1.id,
  testDocEntity1.slug,
  testDocEntity1.team?.id ?? null,
  testDocEntity1.createdAt,
  testDocEntity1.updatedAt,
  testDocEntity1.markedUpToDateAt,
  testDocEntity1.upToDate,
  testDocEntity1.creator.id,
  testDocEntity1.maintainer?.id ?? null,
  testDocEntity1.title,
  testDocEntity1.docTxt
);

/**
 * An example instance of `QnaDocParams`.
 * Strictly for use in testing.
 */
export const testQnaDocParams1 = new QnaDocParams(
  testQnaEntity1.id,
  testQnaEntity1.slug,
  testQnaEntity1.team?.id ?? null,
  testQnaEntity1.createdAt,
  testQnaEntity1.updatedAt,
  testQnaEntity1.markedUpToDateAt,
  testQnaEntity1.upToDate,
  testQnaEntity1.creator.id,
  testQnaEntity1.maintainer?.id ?? null,
  testQnaEntity1.title,
  testQnaEntity1.questionTxt,
  testQnaEntity1.answerTxt
);

/**
 * An example instance of `ResponseHeader`.
 * Strictly for use in testing.
 */
export const testResponseHeader1: ResponseHeader = {
  status: 0,
  QTime: 30,
  zkConnected: true,
};

/**
 * An example instance of `DocResponse`.
 * Strictly for use in testing.
 * Uses testTeamEntity1.
 */
export const testDocResponse1: DocResponse = {
  id: testTeamEntity1.id,
  _version_: BigInt(1),
  entry_type: SolrEntryEnum.Team,
  slug: testTeamEntity1.slug,
  team_name: testTeamEntity1.name,
};

/**
 * An example instance of `DocsResponse`.
 * Strictly for use in testing.
 * Uses testDocResponse1.
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
 * Simulates empty results.
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
 * Simulates a match with highlights.
 */
export const testQueryResponse1: QueryResponse = {
  responseHeader: testResponseHeader1,
  response: testDocsResponse1,
  highlighting: {
    '1': {
      team_name: [testTeamEntity1.name],
    },
  },
};

/**
 * An example instance of `QueryResponse`.
 * Strictly for use in testing.
 */
export const testQueryResponse2: QueryResponse = {
  responseHeader: testResponseHeader1,
  response: testDocsResponse2,
  spellcheck: {
    suggestions: [],
    correctlySpelled: false,
    collations: [
      'collation',
      {
        collationQuery: testTeamEntity1.name,
        hits: 2,
        misspellingsAndCorrections: [],
      },
    ],
  },
};
