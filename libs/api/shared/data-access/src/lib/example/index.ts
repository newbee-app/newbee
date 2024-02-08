import { solrDictionaries } from '@newbee/api/shared/util';
import {
  SolrEntryEnum,
  TeamRoleEnum,
  testAuthenticator1,
  testChallenge1,
  testDoc1,
  testNow1,
  testOrgMember1,
  testOrgMemberInvite1,
  testOrganization1,
  testQna1,
  testSuggestDto1,
  testSuggestResultsDto1,
  testTeam1,
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
import dayjs from 'dayjs';
import {
  DocDocParams,
  OrgMemberDocParams,
  QnaDocParams,
  TeamDocParams,
} from '../class';
import {
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
 * An example instance of `UserEntity`.
 * Strictly for use in testing.
 */
export const testUserEntity1 = {
  ...testUser1,
  id: '1',
  challenge: testChallenge1,
} as UserEntity;

/**
 * An example instance of `UserEntity`.
 * Strictly for use in testing.
 */
export const testUserEntity2 = {
  ...testUser2,
  id: '2',
  challenge: testChallenge1,
} as UserEntity;

/**
 * An example instance of `AuthenticatorEntity`.
 * Strictly for use in testing.
 */
export const testAuthenticatorEntity1 = {
  ...testAuthenticator1,
  user: testUserEntity1,
} as AuthenticatorEntity;

/**
 * An example instance of `UserInvitesEntity`.
 * Strictly for use in testing.
 */
export const testUserInvitesEntity1 = {
  ...testUserInvites1,
  id: '1',
  user: testUserEntity1,
} as UserInvitesEntity;

/**
 * An example instance of `OrganizationEntity`.
 * Strictly for use in testing.
 */
export const testOrganizationEntity1 = {
  ...testOrganization1,
  id: '1',
  suggesterBuiltAt: testNow1,
} as OrganizationEntity;

/**
 * An example instance of `TeamEntity`.
 * Strictly for use in testing.
 */
export const testTeamEntity1 = {
  ...testTeam1,
  id: '1',
  organization: testOrganizationEntity1,
} as TeamEntity;

/**
 * An example instance of `OrgMemberEntity`.
 * Strictly for use in testing.
 */
export const testOrgMemberEntity1 = {
  ...testOrgMember1,
  user: testUserEntity1,
  organization: testOrganizationEntity1,
  id: '1',
} as OrgMemberEntity;

/**
 * An example instance of `OrgMemberInviteEntity`.
 * Strictly for use in testing.
 */
export const testOrgMemberInviteEntity1 = {
  ...testOrgMemberInvite1,
  id: '1',
  organization: testOrganizationEntity1,
  userInvites: testUserInvitesEntity1,
  inviter: testOrgMemberEntity1,
} as OrgMemberInviteEntity;

/**
 * An example instance of `TeamMemberEntity`.
 * Strictly for use in testing.
 */
export const testTeamMemberEntity1 = {
  orgMember: testOrgMemberEntity1,
  team: testTeamEntity1,
  role: TeamRoleEnum.Owner,
} as TeamMemberEntity;

/**
 * An example instance of `DocEntity`.
 * Strictly for use in testing.
 */
export const testDocEntity1 = {
  ...testDoc1,
  id: '1',
  docTxt: 'docTxt',
  creator: testOrgMemberEntity1,
  maintainer: testOrgMemberEntity1,
  organization: testOrganizationEntity1,
  team: testTeamEntity1,
  trueUpToDateDuration: async () =>
    dayjs.duration(testOrganization1.upToDateDuration),
} as DocEntity;

/**
 * An example instance of `QnaEntity`.
 * Strictly for use in testing.
 */
export const testQnaEntity1 = {
  ...testQna1,
  id: '1',
  questionTxt: 'questionTxt',
  answerTxt: 'answerTxt',
  creator: testOrgMemberEntity1,
  maintainer: testOrgMemberEntity1,
  organization: testOrganizationEntity1,
  team: testTeamEntity1,
  trueUpToDateDuration: async () =>
    dayjs.duration(testOrganization1.upToDateDuration),
} as QnaEntity;

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
