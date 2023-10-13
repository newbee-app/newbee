/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types';
import { OrgRoleEnum, TeamRoleEnum } from '../enum';
import type {
  Authenticator,
  Doc,
  DocRelation,
  OrgMember,
  OrgMemberInvite,
  OrgMemberInviteRelation,
  OrgMemberRelation,
  OrgMemberUser,
  Organization,
  OrganizationRelation,
  Post,
  Qna,
  QnaRelation,
  QueryResult,
  Team,
  TeamMember,
  TeamMemberRelation,
  TeamRelation,
  User,
  UserChallenge,
  UserInvites,
  UserRelation,
  UserSettings,
} from '../interface';
import type {
  DocQueryResult,
  OrgMemberQueryResult,
  QnaQueryResult,
  TeamQueryResult,
} from '../type';

/**
 * For internal use in creating a user challenge.
 */
const testChallenge1 = 'challenge1';

/**
 * For internal use whenever we're working with datetimes.
 */
export const testNow1 = new Date();

/**
 * An example instance of Authenticator.
 * Strictly for use in testing.
 */
export const testAuthenticator1: Authenticator = {
  id: '1',
  name: 'MacBook',
  credentialId: 'Y3JlZDE', // 'cred1' with base64url encoding
  credentialPublicKey: 'Y3JlZHBrMQ', // 'credpk1' with base64url encoding
  counter: 0,
  credentialDeviceType: 'singleDevice',
  credentialBackedUp: true,
  transports: null,
};

/**
 * An example instance of UserChallenge.
 * Strictly for use in testing.
 */
export const testUserChallenge1: UserChallenge = {
  challenge: testChallenge1,
};

/**
 * An example instance of UserSettings.
 * Strictly for use in testing.
 */
export const testUserSettings1: UserSettings = {};

/**
 * An example instance of User.
 * Strictly for use in testing.
 */
export const testUser1: User = {
  email: 'johndoe@example.com',
  name: 'John Doe',
  displayName: 'John',
  phoneNumber: '+12025550122',
};

/**
 * An example instance of User.
 * Strictly for use in testing.
 */
export const testUser2: User = {
  email: 'janedoe@example.com',
  name: 'Jane Doe',
  displayName: null,
  phoneNumber: null,
};

/**
 * An example instance of Organization.
 * Strictly for use in testing.
 */
export const testOrganization1: Organization = {
  name: 'NewBee',
  slug: 'newbee',
};

/**
 * An example instance of Organization.
 * Strictly for use in testing.
 */
export const testOrganization2: Organization = {
  name: 'Example Org',
  slug: 'example-org',
};

/**
 * An example instance of Team.
 * Strictly for use in testing.
 */
export const testTeam1: Team = {
  name: 'Development',
  slug: 'development',
};

/**
 * An example instance of TeamMember.
 * Strictly for use in testing.
 */
export const testTeamMember1: TeamMember = {
  role: TeamRoleEnum.Owner,
};

/**
 * An example instance of OrgMember.
 * Strictly for use in testing.
 */
export const testOrgMember1: OrgMember = {
  role: OrgRoleEnum.Owner,
  slug: 'test-org-member-1-slug',
};

/**
 * An example instance of Post.
 * Strictly for use in testing.
 */
export const testPost1: Post = {
  createdAt: testNow1,
  updatedAt: testNow1,
  markedUpToDateAt: testNow1,
  title: 'This is the title of a post',
  slug: 'test-post-1-slug',
};

/**
 * An example instance of Doc.
 * Strictly for use in testing.
 */
export const testDoc1: Doc = {
  ...testPost1,
  title: 'Vacation and PTO policy',
  slug: 'test-doc-1-slug',
  docMarkdoc:
    'All employees are entitled to 20 days of PTO and 5 paid sick days per year. PTO can be used for any purpose such as vacations and family emergencies. However, sick days should be reserved for illness.',
  // TODO: add this in later once we figure out what we wanna do with markdoc
  // renderedHtml: 'renderedhtml',
};

/**
 * An example instance of Qna.
 * Strictly for use in testing.
 */
export const testQna1: Qna = {
  ...testPost1,
  title: 'What is our PTO policy?',
  slug: 'test-qna-1-slug',
  questionMarkdoc: 'More specifically days I can use to go on vacations.',
  // TODO: add this in later once we figure out what we wanna do with markdoc
  // renderedQuestion: 'renderedquestion',
  answerMarkdoc: 'All employees are entitled to 20 days of PTO per year.',
  // TODO: add this in later once we figure out what we wanna do with markdoc
  // renderedAnswer: 'renderedanswer',
};

/**
 * An example instance of UserInvites.
 * Strictly for use in testing.
 */
export const testUserInvites1: UserInvites = {
  email: testUser1.email,
};

/**
 * An example instance of OrgMemberInvite.
 * Strictly for use in testing.
 */
export const testOrgMemberInvite1: OrgMemberInvite = {
  token: 'token1',
  role: OrgRoleEnum.Member,
};

/**
 * An example instance of PublicKeyCredentialCreationOptionsJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testPublicKeyCredentialCreationOptions1: PublicKeyCredentialCreationOptionsJSON =
  {
    user: {
      id: '1',
      name: testUser1.email,
      displayName: testUser1.displayName ?? testUser1.name,
    },
    challenge: testChallenge1,
    excludeCredentials: [],
    rp: {
      name: 'rp1',
    },
    pubKeyCredParams: [],
  };

/**
 * An example instance of PublicKeyCredentialRequestOptionsJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testPublicKeyCredentialRequestOptions1: PublicKeyCredentialRequestOptionsJSON =
  {
    challenge: testChallenge1,
  };

/**
 * An example instance of RegistrationResponseJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testRegistrationResponse1: RegistrationResponseJSON = {
  rawId: 'rawId1',
  id: testAuthenticator1.credentialId,
  type: 'public-key',
  clientExtensionResults: {},
  response: {
    clientDataJSON: 'clientData1',
    attestationObject: 'attestation1',
  },
};

/**
 * An example instance of AuthenticationResponseJSON, from the `@simplewebauthn` package.
 * Strictly for use in testing.
 */
export const testAuthenticationCredential1: AuthenticationResponseJSON = {
  rawId: 'rawId1',
  id: testAuthenticator1.credentialId,
  type: 'public-key',
  clientExtensionResults: {},
  response: {
    authenticatorData: 'authenticatorData1',
    clientDataJSON: 'clientData1',
    signature: 'signature1',
  },
};

/**
 * An example instance of `OrgMemberUser`.
 * Strictly for use in testing.
 */
export const testOrgMemberUser1: OrgMemberUser = {
  orgMember: testOrgMember1,
  user: testUser1,
};

/**
 * An example instance of `OrgMemberQueryResult`.
 * Strictly for use in testing.
 */
export const testOrgMemberQueryResult1: OrgMemberQueryResult =
  testOrgMemberUser1;

/**
 * An example instance of `TeamQueryResult`.
 * Strictly for use in testing.
 */
export const testTeamQueryResult1: TeamQueryResult = testTeam1;

/**
 * An example instance of `DocQueryResult`.
 * Strictly for use in testing.
 */
export const testDocQueryResult1: DocQueryResult = {
  doc: { ...testPost1, docSnippet: testDoc1.docMarkdoc },
  creator: testOrgMemberUser1,
  maintainer: testOrgMemberUser1,
  team: testTeamQueryResult1,
};

/**
 * An example instance of `QnaQueryResult`.
 * Strictly for use in testing.
 */
export const testQnaQueryResult1: QnaQueryResult = {
  qna: {
    ...testPost1,
    questionSnippet: testQna1.questionMarkdoc,
    answerSnippet: testQna1.answerMarkdoc,
  },
  creator: testOrgMemberUser1,
  maintainer: testOrgMemberUser1,
  team: testTeam1,
};

/**
 * An example instance of QueryResult.
 * Strictly for use in testing.
 */
export const testQueryResult1: QueryResult = {
  total: 1,
  offset: 0,
  results: [testTeamQueryResult1],
  suggestion: null,
};

/**
 * An example instance of `OrganizationRelation`.
 * Strictly for use in testing.
 */
export const testOrganizationRelation1: OrganizationRelation = {
  organization: testOrganization1,
  teams: [testTeam1],
  docs: { sample: [testDocQueryResult1], total: 1 },
  qnas: { sample: [testQnaQueryResult1], total: 1 },
  orgMembers: { sample: [testOrgMemberUser1], total: 1 },
};

/**
 * An example instance of `OrganizationRelation`.
 * Strictly for use in testing.
 */
export const testOrganizationRelation2: OrganizationRelation = {
  organization: testOrganization2,
  teams: [testTeam1],
  docs: { sample: [testDocQueryResult1], total: 1 },
  qnas: { sample: [testQnaQueryResult1], total: 1 },
  orgMembers: { sample: [testOrgMemberUser1], total: 1 },
};

/**
 * An example instance of `TeamMemberRelation`.
 * Strictly for use in testing.
 */
export const testTeamMemberRelation1: TeamMemberRelation = {
  teamMember: testTeamMember1,
  team: testTeam1,
  orgMember: testOrgMember1,
  organization: testOrganization1,
  user: testUser1,
};

/**
 * An example instance of `DocRelation`.
 * Strictly for use in testing.
 */
export const testDocRelation1: DocRelation = {
  doc: testDoc1,
  organization: testOrganization1,
  team: testTeam1,
  creator: testOrgMemberUser1,
  maintainer: testOrgMemberUser1,
};

/**
 * An example instance of `QnaRelation`.
 * Strictly for use in testing.
 */
export const testQnaRelation1: QnaRelation = {
  qna: testQna1,
  organization: testOrganization1,
  team: testTeam1,
  creator: testOrgMemberUser1,
  maintainer: testOrgMemberUser1,
};

/**
 * An example instance of `OrgMemberRelation`.
 * Strictly for use in testing.
 */
export const testOrgMemberRelation1: OrgMemberRelation = {
  orgMember: testOrgMember1,
  organization: testOrganization1,
  user: testUser1,
  teams: { sample: [testTeamMemberRelation1], total: 1 },
  createdDocs: { sample: [testDocQueryResult1], total: 1 },
  maintainedDocs: { sample: [testDocQueryResult1], total: 1 },
  createdQnas: { sample: [testQnaQueryResult1], total: 1 },
  maintainedQnas: { sample: [testQnaQueryResult1], total: 1 },
};

/**
 * An example instance of `TeamRelation`.
 * Strictly for use in testing.
 */
export const testTeamRelation1: TeamRelation = {
  team: testTeam1,
  organization: testOrganization1,
  docs: { sample: [testDocQueryResult1], total: 1 },
  qnas: { sample: [testQnaQueryResult1], total: 1 },
  teamMembers: { sample: [testTeamMemberRelation1], total: 1 },
};

/**
 * An example instance of `OrgMemberInviteRelation`.
 * Strictly for use in testing.
 */
export const testOrgMemberInviteRelation1: OrgMemberInviteRelation = {
  orgMemberInvite: testOrgMemberInvite1,
  organization: testOrganization1,
  userInvites: testUserInvites1,
};

/**
 * An example instance of `UserRelation`.
 * Strictly for use in testing.
 */
export const testUserRelation1: UserRelation = {
  user: testUser1,
  organizations: [testOrganization1],
  invites: [testOrgMemberInviteRelation1],
};
