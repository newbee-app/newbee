/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  BaseCreateDocDto,
  BaseCreateOrgMemberInviteDto,
  BaseCreateOrganizationDto,
  BaseCreateQnaDto,
  BaseCreateTeamDto,
  BaseCreateTeamMemberDto,
  BaseCreateUserDto,
  BaseCsrfTokenAndDataDto,
  BaseDocAndMemberDto,
  BaseEmailDto,
  BaseGenerateSlugDto,
  BaseGeneratedSlugDto,
  BaseMagicLinkLoginDto,
  BaseNameDto,
  BaseOrgAndMemberDto,
  BaseQnaAndMemberDto,
  BaseQueryDto,
  BaseQueryResultDto,
  BaseRegistrationResponseDto,
  BaseSlugDto,
  BaseSlugTakenDto,
  BaseSuggestDto,
  BaseSuggestResultDto,
  BaseTeamAndMemberDto,
  BaseTokenDto,
  BaseUpdateAnswerDto,
  BaseUpdateDocDto,
  BaseUpdateOrgMemberDto,
  BaseUpdateOrganizationDto,
  BaseUpdateQnaDto,
  BaseUpdateQuestionDto,
  BaseUpdateTeamDto,
  BaseUpdateTeamMemberDto,
  BaseUpdateUserDto,
  BaseUserRelationAndOptionsDto,
  BaseWebAuthnLoginDto,
} from '../dto';
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
  UserInvites,
  UserRelation,
} from '../interface';
import type {
  DocQueryResult,
  OrgMemberQueryResult,
  QnaQueryResult,
  TeamQueryResult,
} from '../type';

dayjs.extend(duration);

/**
 * For internal use in creating a user challenge.
 */
export const testChallenge1 = 'challenge1';

/**
 * For internal use whenever we're working with datetimes.
 */
export const testNow1 = new Date();

/**
 * For internal use whenever we're working with dayjs.
 */
export const testNowDayjs1 = dayjs(testNow1);

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
  upToDateDuration: 'P6M',
};

/**
 * An example instance of Organization.
 * Strictly for use in testing.
 */
export const testOrganization2: Organization = {
  name: 'Example Org',
  slug: 'example-org',
  upToDateDuration: 'P6M',
};

/**
 * An example instance of Team.
 * Strictly for use in testing.
 */
export const testTeam1: Team = {
  name: 'Development',
  slug: 'development',
  upToDateDuration: null,
};

/**
 * An example instance of Team.
 * Strictly for use in testing.
 */
export const testTeam2: Team = {
  name: 'HR',
  slug: 'hr',
  upToDateDuration: 'P1Y',
};

/**
 * An example instance of TeamMember.
 * Strictly for use in testing.
 */
export const testTeamMember1: TeamMember = {
  role: TeamRoleEnum.Owner,
};

/**
 * An example instance of TeamMember.
 * Strictly for use in testing.
 */
export const testTeamMember2: TeamMember = {
  role: TeamRoleEnum.Member,
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
 * An example instance of OrgMember.
 * STrictly for use in testing.
 */
export const testOrgMember2: OrgMember = {
  role: OrgRoleEnum.Member,
  slug: 'test-org-member-2-slug',
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
  upToDateDuration: null,
  outOfDateAt: dayjs(testNow1).add(dayjs.duration('P6M')).toDate(),
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
  docHtml:
    '<article><p>All employees are entitled to 20 days of PTO and 5 paid sick days per year. PTO can be used for any purpose such as vacations and family emergencies. However, sick days should be reserved for illness.</p></article>',
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
  questionHtml:
    '<article><p>More specifically days I can use to go on vacations.</p></article>',
  answerMarkdoc: 'All employees are entitled to 20 days of PTO per year.',
  answerHtml:
    '<article><p>All employees are entitled to 20 days of PTO per year.</p></article>',
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
 * An example instance of `OrgMemberUser`.
 * Strictly for use in testing.
 */
export const testOrgMemberUser2: OrgMemberUser = {
  orgMember: testOrgMember2,
  user: testUser2,
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
export const testTeamQueryResult1: TeamQueryResult = {
  name: testTeam1.name,
  slug: testTeam1.slug,
};

/**
 * An example instance of `DocQueryResult`.
 * Strictly for use in testing.
 */
export const testDocQueryResult1: DocQueryResult = {
  doc: { ...testPost1, docSnippet: `<p>A <b>bolded</b> doc snippet</p>` },
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
    questionSnippet: `<p>A <b>bolded</b> question snippet</p>`,
    answerSnippet: `<p>A <b>bolded</b> answer snippet</p>`,
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
  members: [testOrgMemberUser1, testOrgMemberUser2],
  docs: { results: [testDocQueryResult1], total: 1, offset: 0 },
  qnas: { results: [testQnaQueryResult1], total: 1, offset: 0 },
};

/**
 * An example instance of `OrganizationRelation`.
 * Strictly for use in testing.
 */
export const testOrganizationRelation2: OrganizationRelation = {
  organization: testOrganization2,
  teams: [testTeam1],
  members: [testOrgMemberUser1, testOrgMemberUser2],
  docs: { results: [testDocQueryResult1], total: 1, offset: 0 },
  qnas: { results: [testQnaQueryResult1], total: 1, offset: 0 },
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
 * An example instance of `TeamMemberRelation`.
 * Strictly for use in testing.
 */
export const testTeamMemberRelation2: TeamMemberRelation = {
  teamMember: testTeamMember2,
  team: testTeam1,
  orgMember: testOrgMember2,
  organization: testOrganization1,
  user: testUser2,
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
  teams: [testTeamMemberRelation1],
  createdDocs: { results: [testDocQueryResult1], total: 1, offset: 0 },
  maintainedDocs: { results: [testDocQueryResult1], total: 1, offset: 0 },
  createdQnas: { results: [testQnaQueryResult1], total: 1, offset: 0 },
  maintainedQnas: { results: [testQnaQueryResult1], total: 1, offset: 0 },
};

/**
 * An example instance of `TeamRelation`.
 * Strictly for use in testing.
 */
export const testTeamRelation1: TeamRelation = {
  team: testTeam1,
  organization: testOrganization1,
  docs: { results: [testDocQueryResult1], total: 1, offset: 0 },
  qnas: { results: [testQnaQueryResult1], total: 1, offset: 0 },
  teamMembers: [testTeamMemberRelation1, testTeamMemberRelation2],
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

/**
 * An example instance of BaseEmailDto.
 * Strictly for use in testing.
 */
export const testBaseEmailDto1: BaseEmailDto = {
  email: testUser1.email,
};

/**
 * An example instance of BaseMagicLinkLoginDto.
 * Strictly for use in testing.
 */
export const testBaseMagicLinkLoginDto1: BaseMagicLinkLoginDto = {
  jwtId: '1234',
  email: testUser1.email,
};

/**
 * An example instance of BaseUserAndOptionsDto.
 * Strictly for use in testing.
 */
export const testBaseUserRelationAndOptionsDto1: BaseUserRelationAndOptionsDto =
  {
    userRelation: testUserRelation1,
    options: testPublicKeyCredentialCreationOptions1,
  };

/**
 * An example instance of BaseWebAuthnLoginDto.
 * Strictly for use in testing.
 */
export const testBaseWebAuthnLoginDto1: BaseWebAuthnLoginDto = {
  email: testUser1.email,
  response: testAuthenticationCredential1,
};

/**
 * An example instance of BaseCsrfTokenDto.
 * Strictly for use in testing.
 */
export const testBaseCsrfTokenAndDataDto1: BaseCsrfTokenAndDataDto = {
  csrfToken: 'csrf1',
  userRelation: testUserRelation1,
};

/**
 * An example instance of BaseCreateUserDto.
 * Strictly for use in testing.
 */
export const testBaseCreateUserDto1: BaseCreateUserDto = {
  email: testUser1.email,
  name: testUser1.name,
  displayName: testUser1.displayName,
  phoneNumber: testUser1.phoneNumber,
};

/**
 * An example instance of BaseUpdateUserDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateUserDto1: BaseUpdateUserDto = {
  name: testUser2.name,
  displayName: null,
  phoneNumber: null,
};

/**
 * An example instance of BaseCreateOrganizationDto.
 * Strictly for use in testing.
 */
export const testBaseCreateOrganizationDto1: BaseCreateOrganizationDto = {
  ...testOrganization1,
};

/**
 * An example instance of BaseOrgAndMemberDto.
 * Strictly for use in testing.
 */
export const testBaseOrgAndMemberDto1: BaseOrgAndMemberDto = {
  organization: testOrganizationRelation1,
  orgMember: testOrgMemberRelation1,
};

/**
 * An example instance of BaseUpdateOrganizationDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateOrganizationDto1: BaseUpdateOrganizationDto = {
  name: 'NewWasp',
  slug: 'new-wasp',
  upToDateDuration: 'P1Y',
};

/**
 * An example instance of BaseCreateTeamDto.
 * Strictly for use in testing.
 */
export const testBaseCreateTeamDto1: BaseCreateTeamDto = {
  name: testTeam1.name,
  slug: testTeam1.slug,
  upToDateDuration: null,
};

/**
 * An example instance of BaseTeamAndMemberDto.
 * Strictly for use in testing.
 */
export const testBaseTeamAndMemberDto1: BaseTeamAndMemberDto = {
  team: testTeamRelation1,
  teamMember: testTeamMember1,
};

/**
 * An example instance of BaseUpdateTeamDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateTeamDto1: BaseUpdateTeamDto = {
  name: 'Human Resources',
  slug: 'human-resources',
  upToDateDuration: 'P1Y',
};

/**
 * An example instance of BaseCreateDocDto.
 * Strictly for use in testing.
 */
export const testBaseCreateDocDto1: BaseCreateDocDto = {
  title: testDoc1.title,
  upToDateDuration: 'P1Y',
  docMarkdoc: testDoc1.docMarkdoc,
  team: testTeam1.slug,
};

/**
 * An example instance of BaseUpdateDocDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateDocDto1: BaseUpdateDocDto = {
  title: 'New title',
  docMarkdoc: 'new raw markdoc',
  upToDateDuration: 'P1Y',
  team: testTeam1.slug,
  maintainer: testOrgMember1.slug,
};

/**
 * An example instance of BaseDocAndMemberDto.
 * Strictly for use in testing.
 */
export const testBaseDocAndMemberDto1: BaseDocAndMemberDto = {
  doc: testDocRelation1,
  teamMember: testTeamMember1,
};

/**
 * An example instance of BaseCreateQnaDto.
 * Strictly for use in testing.
 */
export const testBaseCreateQnaDto1: BaseCreateQnaDto = {
  title: testQna1.title,
  questionMarkdoc: testQna1.questionMarkdoc as string,
  answerMarkdoc: testQna1.answerMarkdoc,
  team: testTeam1.slug,
};

/**
 * An example instance of BaseUpdateQnaDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateQnaDto1: BaseUpdateQnaDto = {
  title: 'New title',
  upToDateDuration: 'P1Y',
  questionMarkdoc: 'new question',
  answerMarkdoc: 'new answer',
  team: testTeam1.slug,
  maintainer: testOrgMember1.slug,
};

/**
 * An example instance of BaseUpdateQuestionDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateQuestionDto1: BaseUpdateQuestionDto = {
  title: 'New title',
  questionMarkdoc: 'new question',
  team: null,
};

/**
 * An example instance of BaseUpdateAnswerDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateAnswerDto1: BaseUpdateAnswerDto = {
  upToDateDuration: 'P1Y',
  answerMarkdoc: 'new answer',
  maintainer: testOrgMember1.slug,
};

/**
 * An example instance of `BaseQnaAndMemberDto`.
 * Strictly for use in testing.
 */
export const testBaseQnaAndMemberDto1: BaseQnaAndMemberDto = {
  qna: testQnaRelation1,
  teamMember: testTeamMember1,
};

/**
 * An example instance of BaseCreateTeamMemberDto.
 * Strictly for use in testing.
 */
export const testBaseCreateTeamMemberDto1: BaseCreateTeamMemberDto = {
  role: testTeamMember1.role,
  orgMemberSlug: testOrgMember1.slug,
};

/**
 * An example instance of BaseUpdateTeamMemberDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateTeamMemberDto1: BaseUpdateTeamMemberDto = {
  role: TeamRoleEnum.Moderator,
};

/**
 * An example instance of BaseUpdateOrgMemberDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateOrgMemberDto1: BaseUpdateOrgMemberDto = {
  role: OrgRoleEnum.Moderator,
};

/**
 * An example instance of BaseCreateOrgMemberInviteDto.
 * Strictly for use in testing.
 */
export const testBaseCreateOrgMemberInviteDto1: BaseCreateOrgMemberInviteDto = {
  email: testUser1.email,
  role: OrgRoleEnum.Member,
};

/**
 * An example instance of `BaseTokenDto`.
 * Strictly for use in testing.
 */
export const testBaseTokenDto1: BaseTokenDto = {
  token: 'token',
};

/**
 * An example instance of BaseRegistrationResponseDto.
 * Strictly for use in testing.
 */
export const testBaseRegistrationResponseDto1: BaseRegistrationResponseDto = {
  response: testRegistrationResponse1,
};

/**
 * An example instance of BaseSuggestDto.
 * Strictly for use in testing.
 */
export const testBaseSuggestDto1: BaseSuggestDto = {
  query: testTeam1.name,
};

/**
 * An example instance of BaseQueryDto.
 * Strictly for use in testing.
 */
export const testBaseQueryDto1: BaseQueryDto = {
  ...testBaseSuggestDto1,
  offset: 0,
};

/**
 * An example instance of BaseSuggestResultDto.
 * Strictly for use in testing.
 */
export const testBaseSuggestResultDto1: BaseSuggestResultDto = {
  suggestions: [testTeamQueryResult1.name],
};

/**
 * An example instance of BaseQueryResultDto.
 * Strictly for use in testing.
 */
export const testBaseQueryResultDto1: BaseQueryResultDto = {
  ...testQueryResult1,
  offset: testBaseQueryDto1.offset,
};

/**
 * An example instance of BaseNameDto.
 * Strictly for use in testing.
 */
export const testBaseNameDto1: BaseNameDto = {
  name: 'new name',
};

/**
 * An example instance of BaseSlugDto.
 * Strictly for use in testing.
 */
export const testBaseSlugDto1: BaseSlugDto = {
  slug: testOrganization1.slug,
};

/**
 * An example instance of BaseSlugTakenDto.
 * Strictly for use in testing.
 */
export const testBaseSlugTakenDto1: BaseSlugTakenDto = {
  slugTaken: true,
};

/**
 * An example instance of BaseNewSlugDto.
 * Strictly for use in testing.
 */
export const testBaseGenerateSlugDto1: BaseGenerateSlugDto = {
  base: testOrganization1.name,
};

/**
 * An example instance of BaseGeneratedSlugDto.
 * Strictly for use in testing.
 */
export const testBaseGeneratedSlugDto1: BaseGeneratedSlugDto = {
  generatedSlug: testOrganization1.slug,
};
