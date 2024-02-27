import {
  solrAppDictionaries,
  solrOrgDictionaries,
} from '@newbee/api/shared/util';
import {
  SolrAppEntryEnum,
  SolrOrgEntryEnum,
  testAdminControls1,
  testAppSuggestDto1,
  testAuthenticator1,
  testChallenge1,
  testDoc1,
  testNow1,
  testOrgMember1,
  testOrgMemberInvite1,
  testOrgSuggestDto1,
  testOrganization1,
  testQna1,
  testSuggestResultsDto1,
  testTeam1,
  testTeamMember1,
  testUser1,
  testUser2,
  testUserInvites1,
  testWaitlistMember1,
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
  CommonEntity,
  DocEntity,
  OrgMemberEntity,
  OrgMemberInviteEntity,
  OrganizationEntity,
  QnaEntity,
  TeamEntity,
  UserEntity,
  UserInvitesEntity,
  WaitlistMemberEntity,
} from '../entity';
import { TeamMemberEntity } from '../entity/team-member.entity';

/**
 * An example instance of CommonEntity.
 * Strictly for use in testing.
 */
export const testCommonEntity1: CommonEntity = {
  id: '1',
  createdAt: testNow1,
  updatedAt: testNow1,
};

/**
 * An example instance of UserInvitesEntity.
 * Strictly for use in testing.
 */
export const testUserInvitesEntity1 = {
  ...testCommonEntity1,
  ...testUserInvites1,
  user: null,
} as UserInvitesEntity;

/**
 * An example instance of UserEntity.
 * Strictly for use in testing.
 */
export const testUserEntity1 = {
  ...testCommonEntity1,
  ...testUser1,
  verifyEmailLastSentAt: testNow1,
  challenge: testChallenge1,
  invites: testUserInvitesEntity1,
} as UserEntity;
testUserInvitesEntity1.user = testUserEntity1;

/**
 * An example instance of UserEntity.
 * Strictly for use in testing.
 */
export const testUserEntity2 = {
  ...testCommonEntity1,
  ...testUser2,
  id: '2',
  verifyEmailLastSentAt: testNow1,
  challenge: testChallenge1,
  invites: testUserInvites1,
} as UserEntity;

/**
 * An example instance of AuthenticatorEntity.
 * Strictly for use in testing.
 */
export const testAuthenticatorEntity1 = {
  ...testCommonEntity1,
  ...testAuthenticator1,
  id: testAuthenticator1.id,
  user: testUserEntity1,
} as AuthenticatorEntity;

/**
 * An example instance of OrganizationEntity.
 * Strictly for use in testing.
 */
export const testOrganizationEntity1 = {
  ...testCommonEntity1,
  ...testOrganization1,
  suggesterBuiltAt: testNow1,
} as OrganizationEntity;

/**
 * An example instance of OrgMemberEntity.
 * Strictly for use in testing.
 */
export const testOrgMemberEntity1 = {
  ...testCommonEntity1,
  ...testOrgMember1,
  user: testUserEntity1,
  organization: testOrganizationEntity1,
} as OrgMemberEntity;

/**
 * An example instance of TeamEntity.
 * Strictly for use in testing.
 */
export const testTeamEntity1 = {
  ...testCommonEntity1,
  ...testTeam1,
  organization: testOrganizationEntity1,
} as TeamEntity;

/**
 * An example instance of OrgMemberInviteEntity.
 * Strictly for use in testing.
 */
export const testOrgMemberInviteEntity1 = {
  ...testCommonEntity1,
  ...testOrgMemberInvite1,
  organization: testOrganizationEntity1,
  userInvites: testUserInvitesEntity1,
  inviter: testOrgMemberEntity1,
} as OrgMemberInviteEntity;

/**
 * An example instance of TeamMemberEntity.
 * Strictly for use in testing.
 */
export const testTeamMemberEntity1 = {
  ...testCommonEntity1,
  ...testTeamMember1,
  orgMember: testOrgMemberEntity1,
  team: testTeamEntity1,
} as TeamMemberEntity;

/**
 * An example instance of DocEntity.
 * Strictly for use in testing.
 */
export const testDocEntity1 = {
  ...testCommonEntity1,
  ...testDoc1,
  docTxt: testDoc1.docMarkdoc,
  organization: testOrganizationEntity1,
  team: testTeamEntity1,
  creator: testOrgMemberEntity1,
  maintainer: testOrgMemberEntity1,
} as DocEntity;

/**
 * An example instance of QnaEntity.
 * Strictly for use in testing.
 */
export const testQnaEntity1 = {
  ...testCommonEntity1,
  ...testQna1,
  questionTxt: testQna1.questionMarkdoc,
  answerTxt: testQna1.answerMarkdoc,
  organization: testOrganizationEntity1,
  team: testTeamEntity1,
  creator: testOrgMemberEntity1,
  maintainer: testOrgMemberEntity1,
} as QnaEntity;

/**
 * An example instance of AdminControlsEntity.
 * Strictly for use in testing.
 */
export const testAdminControlsEntity1 = {
  ...testCommonEntity1,
  ...testAdminControls1,
} as AdminControlsEntity;

/**
 * An example instance of WaitlistMemberEntity.
 * Strictly for use in testing.
 */
export const testWaitlistMemberEntity1 = {
  ...testCommonEntity1,
  ...testWaitlistMember1,
  waitlist: testAdminControlsEntity1,
} as WaitlistMemberEntity;

/**
 * An example instance of DocDocParams.
 * Strictly for use in testing.
 */
export const testDocDocParams1 = new DocDocParams(testDocEntity1);

/**
 * An example instance of QnaDocParams.
 * Strictly for use in testing.
 */
export const testQnaDocParams1 = new QnaDocParams(testQnaEntity1);

/**
 * An example instance of TeamDocParams.
 * Strictly for use in testing.
 */
export const testTeamDocParams1 = new TeamDocParams(testTeamEntity1);

/**
 * An example instance of OrgMemberDocParams.
 * Strictly for use in testing.
 */
export const testOrgMemberDocParams1 = new OrgMemberDocParams(
  testOrgMemberEntity1,
);

/**
 * An example instance of ResponseHeader.
 * Strictly for use in testing.
 */
export const testResponseHeader1: ResponseHeader = {
  status: 0,
  QTime: 30,
  zkConnected: true,
};

/**
 * An example instance of DocResponse.
 * Strictly for use in testing.
 * Uses testTeamEntity1.
 */
export const testDocResponse1: DocResponse = {
  id: testTeamEntity1.id,
  _version_: BigInt(1),
  entry_type: SolrOrgEntryEnum.Team,
  slug: testTeamEntity1.slug,
  created_at: testTeamEntity1.createdAt.toISOString(),
  updated_at: testTeamEntity1.updatedAt.toISOString(),
  team_name: testTeamEntity1.name,
};

/**
 * An example instance of DocResponse.
 * Strictly for use in testing.
 * Use testUserEntity1.
 */
export const testDocResponse2: DocResponse = {
  id: testUserEntity1.id,
  _version_: BigInt(1),
  entry_type: SolrAppEntryEnum.User,
  created_at: testUserEntity1.createdAt.toISOString(),
  updated_at: testUserEntity1.updatedAt.toISOString(),
  user_email: testUserEntity1.email,
  user_name: testUserEntity1.name,
  user_display_name: testUserEntity1.displayName as string,
  user_phone_number: testUserEntity1.phoneNumber as string,
  user_app_role: testUserEntity1.role,
  user_email_verified: testUserEntity1.emailVerified,
};

/**
 * An example instance of DocsResponse.
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
 * An example instance of DocsResponse.
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
 * An example instance of DocsResponse.
 * Strictly for use in testing.
 * Uses testDocResponse2.
 */
export const testDocsResponse3: DocsResponse = {
  numFound: 1,
  start: 0,
  numFoundExact: true,
  docs: [testDocResponse2],
};

/**
 * An example instance of QueryResponse.
 * Strictly for use in testing.
 * Simulates an org match.
 */
export const testQueryResponse1: QueryResponse = {
  responseHeader: testResponseHeader1,
  response: testDocsResponse1,
};

/**
 * An example instance of QueryResponse.
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
 * An example instance of QueryResponse.
 * Strictly for use in testing.
 * Simulates org suggester suggestions.
 */
export const testQueryResponse3: QueryResponse = {
  responseHeader: testResponseHeader1,
  suggest: {
    [solrOrgDictionaries.All]: {
      [testOrgSuggestDto1.query]: {
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

/**
 * An example instance of QueryResponse.
 * Strictly for use in testing.
 * Simulates an app match.
 */
export const testQueryResponse4: QueryResponse = {
  responseHeader: testResponseHeader1,
  response: testDocsResponse3,
};

/**
 * An example instance of QueryResponse.
 * Strictly for use in testing.
 * Simulates app suggester suggestions.
 */
export const testQueryResponse5: QueryResponse = {
  responseHeader: testResponseHeader1,
  suggest: {
    [solrAppDictionaries.All]: {
      [testAppSuggestDto1.query]: {
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
