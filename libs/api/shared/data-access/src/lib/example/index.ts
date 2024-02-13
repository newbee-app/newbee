import { solrDictionaries } from '@newbee/api/shared/util';
import {
  SolrEntryEnum,
  testAuthenticator1,
  testChallenge1,
  testCommonEntityFields1,
  testDoc1,
  testNow1,
  testOrgMember1,
  testOrgMemberInvite1,
  testOrganization1,
  testQna1,
  testSuggestDto1,
  testSuggestResultsDto1,
  testTeam1,
  testTeamMember1,
  testUser1,
  testUser2,
  testUserInvites1,
} from '@newbee/shared/util';
import type {
  DocResponse,
  DocsResponse,
  QueryResponse,
  ResponseHeader,
} from '@newbee/solr-cli';
import {
  DocDocParams,
  OrgMemberDocParams,
  QnaDocParams,
  TeamDocParams,
} from '../class';
import {
  AdminControlsEntity,
  AuthenticatorEntity,
  DocEntity,
  OrgMemberEntity,
  OrgMemberInviteEntity,
  OrganizationEntity,
  QnaEntity,
  TeamEntity,
  UserEntity,
  UserInvitesEntity,
} from '../entity';
import { TeamMemberEntity } from '../entity/team-member.entity';

/**
 * An example instance of `UserInvitesEntity`.
 * Strictly for use in testing.
 */
export const testUserInvitesEntity1 = new UserInvitesEntity(
  '1',
  testUserInvites1.email,
);

/**
 * An example instance of `UserEntity`.
 * Strictly for use in testing.
 */
export const testUserEntity1 = new UserEntity(
  '1',
  testUser1.email,
  testUser1.name,
  testUser1.displayName,
  testUser1.phoneNumber,
  testChallenge1,
  testUser1.role,
  testUserInvitesEntity1,
);
testUserInvitesEntity1.user = testUserEntity1;

/**
 * An example instance of `UserEntity`.
 * Strictly for use in testing.
 */
export const testUserEntity2 = new UserEntity(
  '2',
  testUser2.email,
  testUser2.name,
  testUser2.displayName,
  testUser2.phoneNumber,
  testChallenge1,
  testUser2.role,
  new UserInvitesEntity('2', testUser2.email),
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
  testAuthenticator1.transports,
  testUserEntity1,
);
testAuthenticatorEntity1.id = testAuthenticator1.id;

/**
 * An example instance of `OrganizationEntity`.
 * Strictly for use in testing.
 */
export const testOrganizationEntity1 = new OrganizationEntity(
  '1',
  testOrganization1.name,
  testOrganization1.slug,
  testOrganization1.upToDateDuration,
  testUserEntity1,
);
testOrganizationEntity1.suggesterBuiltAt = testNow1;

/**
 * An example instance of `OrgMemberEntity`.
 * Strictly for use in testing.
 */
export const testOrgMemberEntity1 = new OrgMemberEntity(
  testUserEntity1,
  testOrganizationEntity1,
  testOrgMember1.role,
);
testOrgMemberEntity1.id = '1';

/**
 * An example instance of `TeamEntity`.
 * Strictly for use in testing.
 */
export const testTeamEntity1 = new TeamEntity(
  '1',
  testTeam1.name,
  testTeam1.slug,
  testTeam1.upToDateDuration,
  testOrgMemberEntity1,
);
Object.assign(testTeamEntity1, testCommonEntityFields1);

/**
 * An example instance of `OrgMemberInviteEntity`.
 * Strictly for use in testing.
 */
export const testOrgMemberInviteEntity1 = new OrgMemberInviteEntity(
  '1',
  testUserInvitesEntity1,
  testOrgMemberEntity1,
  testOrgMemberInvite1.role,
);

/**
 * An example instance of `TeamMemberEntity`.
 * Strictly for use in testing.
 */
export const testTeamMemberEntity1 = new TeamMemberEntity(
  testOrgMemberEntity1,
  testTeamEntity1,
  testTeamMember1.role,
);

/**
 * An example instance of `DocEntity`.
 * Strictly for use in testing.
 */
export const testDocEntity1 = new DocEntity(
  '1',
  testDoc1.title,
  testDoc1.upToDateDuration,
  testTeamEntity1,
  testOrgMemberEntity1,
  testDoc1.docMarkdoc,
);

/**
 * An example instance of `QnaEntity`.
 * Strictly for use in testing.
 */
export const testQnaEntity1 = new QnaEntity(
  '1',
  testQna1.title,
  testTeamEntity1,
  testOrgMemberEntity1,
  testQna1.questionMarkdoc,
  testQna1.answerMarkdoc,
);
testQnaEntity1.maintainer = testOrgMemberEntity1;

/**
 * An example instance of `AdminControlsEntity`.
 * Strictly for use in testing.
 */
export const testAdminControlsEntity1 = new AdminControlsEntity();

/**
 * An example instance of `DocDocParams`.
 * Strictly for use in testing.
 */
export const testDocDocParams1 = new DocDocParams(testDocEntity1);

/**
 * An example instance of `QnaDocParams`.
 * Strictly for use in testing.
 */
export const testQnaDocParams1 = new QnaDocParams(testQnaEntity1);

/**
 * An example instance of `TeamDocParams`.
 * Strictly for use in testing.
 */
export const testTeamDocParams1 = new TeamDocParams(testTeamEntity1);

/**
 * An example instance of `OrgMemberDocParams`.
 * Strictly for use in testing.
 */
export const testOrgMemberDocParams1 = new OrgMemberDocParams(
  testOrgMemberEntity1,
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
  created_at: testTeamEntity1.createdAt.toISOString(),
  updated_at: testTeamEntity1.updatedAt.toISOString(),
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
 * Simulates spellcheck suggestions.
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

/**
 * An example instance of `QueryResponse`.
 * Strictly for use in testing.
 * Simulates suggester suggestions.
 */
export const testQueryResponse3: QueryResponse = {
  responseHeader: testResponseHeader1,
  suggest: {
    [solrDictionaries.all]: {
      [testSuggestDto1.query]: {
        numFound: 1,
        suggestions: [
          {
            term: testSuggestResultsDto1.suggestions[0] as string,
            weight: 5,
            payload: '',
          },
        ],
      },
    },
  },
};
