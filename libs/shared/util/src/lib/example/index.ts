import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { defaultLimit } from '../constant';
import {
  AdminControlsRelationAndUsersDto,
  AppSearchDto,
  AppSearchResultsDto,
  AppSuggestDto,
  CreateDocDto,
  CreateOrgMemberInviteDto,
  CreateOrganizationDto,
  CreateQnaDto,
  CreateTeamDto,
  CreateTeamMemberDto,
  CreateUserDto,
  CreateWaitlistMemberDto,
  CsrfTokenAndDataDto,
  DocAndMemberDto,
  EmailDto,
  GenerateSlugDto,
  GeneratedSlugDto,
  GetOrgMemberPostsDto,
  MagicLinkLoginDto,
  NameDto,
  OrgAndMemberDto,
  OrgSearchDto,
  OrgSearchResultsDto,
  OrgSuggestDto,
  QnaAndMemberDto,
  RegistrationResponseDto,
  SlugDto,
  SlugTakenDto,
  SuggestResultsDto,
  TeamAndMemberDto,
  TokenDto,
  UpdateAdminControlsDto,
  UpdateAnswerDto,
  UpdateDocDto,
  UpdateOrgMemberDto,
  UpdateOrganizationDto,
  UpdateQnaDto,
  UpdateQuestionDto,
  UpdateTeamDto,
  UpdateTeamMemberDto,
  UpdateUserDto,
  UserRelationAndOptionsDto,
  WebAuthnLoginDto,
} from '../dto';
import { OrgRoleEnum, TeamRoleEnum, UserRoleEnum } from '../enum';
import type {
  AdminControls,
  AdminControlsRelation,
  Authenticator,
  CommonEntityFields,
  Doc,
  DocRelation,
  OffsetAndLimit,
  OrgMember,
  OrgMemberInvite,
  OrgMemberInviteRelation,
  OrgMemberRelation,
  OrgMemberUser,
  Organization,
  OrganizationRelation,
  PaginatedResults,
  Post,
  PublicAdminControls,
  PublicUser,
  Qna,
  QnaRelation,
  Team,
  TeamMember,
  TeamMemberRelation,
  TeamRelation,
  User,
  UserInvites,
  UserRelation,
  WaitlistMember,
} from '../interface';
import type {
  DocSearchResult,
  OrgMemberSearchResult,
  QnaSearchResult,
  TeamSearchResult,
  UserSearchResult,
  WaitlistMemberSearchResult,
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
 * An example instance of CommonEntityFields.
 * Strictly for use in testing.
 */
export const testCommonEntityFields1: CommonEntityFields = {
  createdAt: testNow1,
  updatedAt: testNow1,
};

/**
 * An example instance of Authenticator.
 * Strictly for use in testing.
 */
export const testAuthenticator1: Authenticator = {
  ...testCommonEntityFields1,
  id: 'authenticator-1',
  name: 'MacBook',
  credentialId: 'Y3JlZDE', // 'cred1' with base64url encoding
  credentialPublicKey: 'Y3JlZHBrMQ', // 'credpk1' with base64url encoding
  counter: 0,
  credentialDeviceType: 'singleDevice',
  credentialBackedUp: true,
  transports: null,
};

/**
 * An example instance of PublicUser.
 * Strictly for use in testing.
 */
export const testPublicUser1: PublicUser = {
  email: 'johndoe@example.com',
  name: 'John Doe',
  displayName: 'John',
  phoneNumber: '+12025550122',
};

/**
 * An example instance of PublicUser.
 * Strictly for use in testing.
 */
export const testPublicUser2: PublicUser = {
  email: 'janedoe@example.com',
  name: 'Jane Doe',
  displayName: null,
  phoneNumber: null,
};

/**
 * An example instance of User.
 * Strictly for use in testing.
 */
export const testUser1: User = {
  ...testCommonEntityFields1,
  ...testPublicUser1,
  role: UserRoleEnum.Admin,
  emailVerified: true,
};

/**
 * An example instance of User.
 * Strictly for use in testing.
 */
export const testUser2: User = {
  ...testCommonEntityFields1,
  ...testPublicUser2,
  role: UserRoleEnum.User,
  emailVerified: false,
};

/**
 * An example instance of Organization.
 * Strictly for use in testing.
 */
export const testOrganization1: Organization = {
  ...testCommonEntityFields1,
  name: 'NewBee',
  slug: 'newbee',
  upToDateDuration: 'P6M',
};

/**
 * An example instance of Organization.
 * Strictly for use in testing.
 */
export const testOrganization2: Organization = {
  ...testCommonEntityFields1,
  name: 'Example Org',
  slug: 'example-org',
  upToDateDuration: 'P6M',
};

/**
 * An example instance of OrgMember.
 * Strictly for use in testing.
 */
export const testOrgMember1: OrgMember = {
  ...testCommonEntityFields1,
  role: OrgRoleEnum.Owner,
  slug: 'test-org-member-1-slug',
};

/**
 * An example instance of OrgMember.
 * STrictly for use in testing.
 */
export const testOrgMember2: OrgMember = {
  ...testCommonEntityFields1,
  role: OrgRoleEnum.Member,
  slug: 'test-org-member-2-slug',
};

/**
 * An example instance of Post.
 * Strictly for use in testing.
 */
export const testPost1: Post = {
  ...testCommonEntityFields1,
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
 * An example instance of Doc.
 * Strictly for use in testing.
 */
export const testDoc2: Doc = {
  ...testDoc1,
  title: 'A Primer on VS Code',
  slug: 'test-doc-2-slug',
  docMarkdoc:
    'VS Code is a great FOSS tool for our developers. In this doc, we will provide some tips and tricks in getting the most ouf of it.',
  docHtml:
    '<article><p>VS Code is a great FOSS tool for our developers. In this doc, we will provide some tips and tricks in getting the most ouf of it.</p></article>',
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
 * An example instance of Team.
 * Strictly for use in testing.
 */
export const testTeam1: Team = {
  ...testCommonEntityFields1,
  name: 'Development',
  slug: 'development',
  upToDateDuration: null,
};

/**
 * An example instance of Team.
 * Strictly for use in testing.
 */
export const testTeam2: Team = {
  ...testCommonEntityFields1,
  name: 'HR',
  slug: 'hr',
  upToDateDuration: 'P1Y',
};

/**
 * An example instance of TeamMember.
 * Strictly for use in testing.
 */
export const testTeamMember1: TeamMember = {
  ...testCommonEntityFields1,
  role: TeamRoleEnum.Owner,
};

/**
 * An example instance of TeamMember.
 * Strictly for use in testing.
 */
export const testTeamMember2: TeamMember = {
  ...testCommonEntityFields1,
  role: TeamRoleEnum.Member,
};

/**
 * An example instance of UserInvites.
 * Strictly for use in testing.
 */
export const testUserInvites1: UserInvites = {
  ...testCommonEntityFields1,
  email: testUser1.email,
};

/**
 * An example instance of OrgMemberInvite.
 * Strictly for use in testing.
 */
export const testOrgMemberInvite1: OrgMemberInvite = {
  ...testCommonEntityFields1,
  token: 'token1',
  role: OrgRoleEnum.Member,
};

/**
 * An example instance of PublicAdminControls.
 * Strictly for use in testing.
 */
export const testPublicAdminControls1: PublicAdminControls = {
  allowRegistration: true,
  allowWaitlist: true,
};

/**
 * An example instance of AdminControls.
 * Strictly for use in testing.
 */
export const testAdminControls1: AdminControls = {
  ...testCommonEntityFields1,
  ...testPublicAdminControls1,
};

/**
 * An example instance of WaitlistMember.
 * Strictly for use in testing.
 */
export const testWaitlistMember1: WaitlistMember = {
  ...testCommonEntityFields1,
  email: testUser1.email,
  name: testUser1.name,
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
  user: testPublicUser1,
};

/**
 * An example instance of OrgMemberUser.
 * Strictly for use in testing.
 */
export const testOrgMemberUser2: OrgMemberUser = {
  orgMember: testOrgMember2,
  user: testPublicUser2,
};

/**
 * An example instance of OrgMemberSearchResult.
 * Strictly for use in testing.
 */
export const testOrgMemberSearchResult1: OrgMemberSearchResult =
  testOrgMemberUser1;

/**
 * An example instance of TeamSearchResult.
 * Strictly for use in testing.
 */
export const testTeamSearchResult1: TeamSearchResult = {
  ...testCommonEntityFields1,
  name: testTeam1.name,
  slug: testTeam1.slug,
};

/**
 * An example instance of TeamSearchResult.
 * Strictly for use in testing.
 */
export const testTeamSearchResult2: TeamSearchResult = {
  ...testCommonEntityFields1,
  name: testTeam2.name,
  slug: testTeam2.slug,
};

/**
 * An example instance of DocSearchResult.
 * Strictly for use in testing.
 */
export const testDocSearchResult1: DocSearchResult = {
  doc: {
    ...testDoc1,
    docSnippet:
      '<p>All <b>employees</b> are entitled to 20 days of PTO and 5 paid sick days per year.</p>',
  },
  creator: testOrgMemberUser1,
  maintainer: testOrgMemberUser1,
  team: testTeamSearchResult1,
};

/**
 * An example instance of DocSearchResult.
 * Strictly for use in testing.
 */
export const testDocSearchResult2: DocSearchResult = {
  doc: {
    ...testDoc2,
    docSnippet:
      '<p><b>VS Code</b> is a great FOSS tool for our developers.</p>',
  },
  creator: testOrgMemberUser1,
  maintainer: testOrgMemberUser2,
  team: testTeamSearchResult2,
};

/**
 * An example instance of QnaSearchResult.
 * Strictly for use in testing.
 */
export const testQnaSearchResult1: QnaSearchResult = {
  qna: {
    ...testQna1,
    questionSnippet: `<p>A <b>bolded</b> question snippet</p>`,
    answerSnippet: `<p>A <b>bolded</b> answer snippet</p>`,
  },
  creator: testOrgMemberUser1,
  maintainer: testOrgMemberUser1,
  team: testTeam1,
};

/**
 * An example instance of UserSearchResult.
 * Strictly for use in testing.
 */
export const testUserSearchResult1: UserSearchResult = testUser1;

/**
 * An example instance of WaitlistMemberSearchResult.
 * Strictly for use in testing.
 */
export const testWaitlistMemberSearchResult1: WaitlistMemberSearchResult =
  testWaitlistMember1;

/**
 * An example instance of OffsetAndLimit.
 * Strictly for use in testing.
 */
export const testOffsetAndLimit1: OffsetAndLimit = {
  offset: 0,
  limit: defaultLimit,
};

/**
 * An example instance of OrganizationRelation.
 * Strictly for use in testing.
 */
export const testOrganizationRelation1: OrganizationRelation = {
  organization: testOrganization1,
  teams: [testTeam1],
  members: [testOrgMemberUser1, testOrgMemberUser2],
  docs: {
    ...testOffsetAndLimit1,
    results: [testDocSearchResult1],
    total: 1,
  },
  qnas: {
    ...testOffsetAndLimit1,
    results: [testQnaSearchResult1],
    total: 1,
  },
};

/**
 * An example instance of OrganizationRelation.
 * Strictly for use in testing.
 */
export const testOrganizationRelation2: OrganizationRelation = {
  organization: testOrganization2,
  teams: [testTeam1],
  members: [testOrgMemberUser1, testOrgMemberUser2],
  docs: {
    ...testOffsetAndLimit1,
    results: [testDocSearchResult1],
    total: 1,
  },
  qnas: {
    ...testOffsetAndLimit1,
    results: [testQnaSearchResult1],
    total: 1,
  },
};

/**
 * An example instance of TeamMemberRelation.
 * Strictly for use in testing.
 */
export const testTeamMemberRelation1: TeamMemberRelation = {
  teamMember: testTeamMember1,
  team: testTeam1,
  orgMember: testOrgMember1,
  organization: testOrganization1,
  user: testPublicUser1,
};

/**
 * An example instance of TeamMemberRelation.
 * Strictly for use in testing.
 */
export const testTeamMemberRelation2: TeamMemberRelation = {
  teamMember: testTeamMember2,
  team: testTeam1,
  orgMember: testOrgMember2,
  organization: testOrganization1,
  user: testPublicUser2,
};

/**
 * An example instance of DocRelation.
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
 * An example instance of QnaRelation.
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
 * An example instance of OrgMemberRelation.
 * Strictly for use in testing.
 */
export const testOrgMemberRelation1: OrgMemberRelation = {
  orgMember: testOrgMember1,
  organization: testOrganization1,
  user: testPublicUser1,
  teams: [testTeamMemberRelation1],
  createdDocs: {
    ...testOffsetAndLimit1,
    results: [testDocSearchResult1],
    total: 1,
  },
  maintainedDocs: {
    ...testOffsetAndLimit1,
    results: [testDocSearchResult1],
    total: 1,
  },
  createdQnas: {
    ...testOffsetAndLimit1,
    results: [testQnaSearchResult1],
    total: 1,
  },
  maintainedQnas: {
    ...testOffsetAndLimit1,
    results: [testQnaSearchResult1],
    total: 1,
  },
};

/**
 * An example instance of TeamRelation.
 * Strictly for use in testing.
 */
export const testTeamRelation1: TeamRelation = {
  team: testTeam1,
  organization: testOrganization1,
  docs: {
    ...testOffsetAndLimit1,
    results: [testDocSearchResult1],
    total: 1,
  },
  qnas: {
    ...testOffsetAndLimit1,
    results: [testQnaSearchResult1],
    total: 1,
  },
  teamMembers: [testTeamMemberRelation1, testTeamMemberRelation2],
};

/**
 * An example instance of OrgMemberInviteRelation.
 * Strictly for use in testing.
 */
export const testOrgMemberInviteRelation1: OrgMemberInviteRelation = {
  orgMemberInvite: testOrgMemberInvite1,
  organization: testOrganization1,
  userInvites: testUserInvites1,
};

/**
 * An example instance of UserRelation.
 * Strictly for use in testing.
 */
export const testUserRelation1: UserRelation = {
  user: testUser1,
  organizations: [testOrganization1],
  invites: [testOrgMemberInviteRelation1],
};

/**
 * An example instance of AdminControlsRelation.
 * Strictly for use in testing.
 */
export const testAdminControlsRelation1: AdminControlsRelation = {
  adminControls: testAdminControls1,
  waitlist: {
    ...testOffsetAndLimit1,
    results: [testWaitlistMember1],
    total: 1,
  },
};

/**
 * An example instance of AdminControlsRelationAndUsersDto.
 * Strictly for use in testing.
 */
export const testAdminControlsRelationAndUsersDto1 =
  new AdminControlsRelationAndUsersDto(testAdminControlsRelation1, {
    ...testOffsetAndLimit1,
    results: [testUser1, testUser2],
    total: 2,
  });

/**
 * An example instance of CreateWaitlistMemberDto.
 * Strictly for use in testing.
 */
export const testCreateWaitlistMemberDto1 = new CreateWaitlistMemberDto(
  testWaitlistMember1.email,
  testWaitlistMember1.name,
);

/**
 * An example instance of EmailDto.
 * Strictly for use in testing.
 */
export const testEmailDto1 = new EmailDto(testUser1.email);

/**
 * An example instance of MagicLinkLoginDto.
 * Strictly for use in testing.
 */
export const testMagicLinkLoginDto1 = new MagicLinkLoginDto(
  '1234',
  testUser1.email,
);

/**
 * An example instance of UserAndOptionsDto.
 * Strictly for use in testing.
 */
export const testUserRelationAndOptionsDto1 = new UserRelationAndOptionsDto(
  testUserRelation1,
  testPublicKeyCredentialCreationOptions1,
);

/**
 * An example instance of WebAuthnLoginDto.
 * Strictly for use in testing.
 */
export const testWebAuthnLoginDto1 = new WebAuthnLoginDto(
  testUser1.email,
  testAuthenticationCredential1,
);

/**
 * An example instance of CsrfTokenDto.
 * Strictly for use in testing.
 */
export const testCsrfTokenAndDataDto1 = new CsrfTokenAndDataDto(
  'csrf1',
  testPublicAdminControls1,
  testUserRelation1,
);

/**
 * An example instance of CreateUserDto.
 * Strictly for use in testing.
 */
export const testCreateUserDto1 = new CreateUserDto(
  testUser1.email,
  testUser1.name,
  testUser1.displayName,
  testUser1.phoneNumber,
);

/**
 * An example instance of UpdateUserDto.
 * Strictly for use in testing.
 */
export const testUpdateUserDto1 = new UpdateUserDto({
  name: testUser2.name,
  displayName: null,
  phoneNumber: null,
});

/**
 * An example instance of CreateOrganizationDto.
 * Strictly for use in testing.
 */
export const testCreateOrganizationDto1 = new CreateOrganizationDto(
  testOrganization1.name,
  testOrganization1.slug,
  testOrganization1.upToDateDuration,
);

/**
 * An example instance of OrgAndMemberDto.
 * Strictly for use in testing.
 */
export const testOrgAndMemberDto1 = new OrgAndMemberDto(
  testOrganizationRelation1,
  testOrgMemberRelation1,
);

/**
 * An example instance of UpdateOrganizationDto.
 * Strictly for use in testing.
 */
export const testUpdateOrganizationDto1 = new UpdateOrganizationDto({
  name: 'NewWasp',
  slug: 'new-wasp',
  upToDateDuration: 'P1Y',
});

/**
 * An example instance of CreateTeamDto.
 * Strictly for use in testing.
 */
export const testCreateTeamDto1 = new CreateTeamDto(
  testTeam1.name,
  testTeam1.slug,
  null,
);

/**
 * An example instance of TeamAndMemberDto.
 * Strictly for use in testing.
 */
export const testTeamAndMemberDto1 = new TeamAndMemberDto(
  testTeamRelation1,
  testTeamMember1,
);

/**
 * An example instance of UpdateTeamDto.
 * Strictly for use in testing.
 */
export const testUpdateTeamDto1 = new UpdateTeamDto({
  name: 'Human Resources',
  slug: 'human-resources',
  upToDateDuration: 'P1Y',
});

/**
 * An example instance of CreateDocDto.
 * Strictly for use in testing.
 */
export const testCreateDocDto1 = new CreateDocDto(
  testDoc1.title,
  'P1Y',
  testDoc1.docMarkdoc,
  testTeam1.slug,
);

/**
 * An example instance of UpdateDocDto.
 * Strictly for use in testing.
 */
export const testUpdateDocDto1 = new UpdateDocDto({
  title: 'New title',
  docMarkdoc: 'new raw markdoc',
  upToDateDuration: 'P1Y',
  team: testTeam1.slug,
  maintainer: testOrgMember1.slug,
});

/**
 * An example instance of DocAndMemberDto.
 * Strictly for use in testing.
 */
export const testDocAndMemberDto1 = new DocAndMemberDto(
  testDocRelation1,
  testTeamMember1,
);

/**
 * An example instance of CreateQnaDto.
 * Strictly for use in testing.
 */
export const testCreateQnaDto1 = new CreateQnaDto(
  testQna1.title,
  testQna1.questionMarkdoc,
  testQna1.answerMarkdoc,
  testTeam1.slug,
);

/**
 * An example instance of UpdateQnaDto.
 * Strictly for use in testing.
 */
export const testUpdateQnaDto1 = new UpdateQnaDto({
  title: 'New title',
  upToDateDuration: 'P1Y',
  questionMarkdoc: 'new question',
  answerMarkdoc: 'new answer',
  team: testTeam1.slug,
  maintainer: testOrgMember1.slug,
});

/**
 * An example instance of UpdateQuestionDto.
 * Strictly for use in testing.
 */
export const testUpdateQuestionDto1 = new UpdateQuestionDto({
  title: 'New title',
  questionMarkdoc: 'new question',
  team: null,
});

/**
 * An example instance of UpdateAnswerDto.
 * Strictly for use in testing.
 */
export const testUpdateAnswerDto1 = new UpdateAnswerDto({
  upToDateDuration: 'P1Y',
  answerMarkdoc: 'new answer',
  maintainer: testOrgMember1.slug,
});

/**
 * An example instance of QnaAndMemberDto.
 * Strictly for use in testing.
 */
export const testQnaAndMemberDto1 = new QnaAndMemberDto(
  testQnaRelation1,
  testTeamMember1,
);

/**
 * An example instance of CreateTeamMemberDto.
 * Strictly for use in testing.
 */
export const testCreateTeamMemberDto1 = new CreateTeamMemberDto(
  testTeamMember1.role,
  testOrgMember1.slug,
);

/**
 * An example instance of UpdateTeamMemberDto.
 * Strictly for use in testing.
 */
export const testUpdateTeamMemberDto1 = new UpdateTeamMemberDto(
  TeamRoleEnum.Moderator,
);

/**
 * An example instance of UpdateOrgMemberDto.
 * Strictly for use in testing.
 */
export const testUpdateOrgMemberDto1 = new UpdateOrgMemberDto(
  OrgRoleEnum.Moderator,
);

/**
 * An example instance of CreateOrgMemberInviteDto.
 * Strictly for use in testing.
 */
export const testCreateOrgMemberInviteDto1 = new CreateOrgMemberInviteDto(
  testUser1.email,
  OrgRoleEnum.Member,
);

/**
 * An example instance of UpdateAdminControlsDto.
 * Strictly for use in testing.
 */
export const testUpdateAdminControlsDto1 = new UpdateAdminControlsDto({
  allowRegistration: false,
  allowWaitlist: false,
});

/**
 * An example instance of `TokenDto`.
 * Strictly for use in testing.
 */
export const testTokenDto1 = new TokenDto('token');

/**
 * An example instance of RegistrationResponseDto.
 * Strictly for use in testing.
 */
export const testRegistrationResponseDto1 = new RegistrationResponseDto(
  testRegistrationResponse1,
);

/**
 * An example instance of OrgSuggestDto.
 * Strictly for use in testing.
 */
export const testOrgSuggestDto1 = new OrgSuggestDto();
testOrgSuggestDto1.query = testTeam1.name;

/**
 * An example instance of AppSuggestDto.
 * Strictly for use in testing.
 */
export const testAppSuggestDto1 = new AppSuggestDto();
testAppSuggestDto1.query = testUser1.name;

/**
 * An example instance of OrgSearchDto.
 * Strictly for use in testing.
 */
export const testOrgSearchDto1 = new OrgSearchDto();
Object.assign(testOrgSearchDto1, testOrgSuggestDto1);

/**
 * An example instance of AppSearchDto.
 * Strictly for use in testing.
 */
export const testAppSearchDto1 = new AppSearchDto();
Object.assign(testAppSearchDto1, testAppSuggestDto1);

/**
 * An example instance of SuggestResultsDto.
 * Strictly for use in testing.
 */
export const testSuggestResultsDto1 = new SuggestResultsDto([
  testTeamSearchResult1.name,
]);

/**
 * An example instance of NameDto.
 * Strictly for use in testing.
 */
export const testNameDto1 = new NameDto('new name');

/**
 * An example instance of SlugDto.
 * Strictly for use in testing.
 */
export const testSlugDto1 = new SlugDto(testOrganization1.slug);

/**
 * An example instance of SlugTakenDto.
 * Strictly for use in testing.
 */
export const testSlugTakenDto1 = new SlugTakenDto(true);

/**
 * An example instance of GenerateSlugDto.
 * Strictly for use in testing.
 */
export const testGenerateSlugDto1 = new GenerateSlugDto(testOrganization1.name);

/**
 * An example instance of GeneratedSlugDto.
 * Strictly for use in testing.
 */
export const testGeneratedSlugDto1 = new GeneratedSlugDto(
  testOrganization1.slug,
);

/**
 * An example instance of GetOrgMemberPostsDto.
 * Strictly for use in testing.
 */
export const testGetOrgMemberPostsDto1 = new GetOrgMemberPostsDto(
  0,
  defaultLimit,
);

/**
 * An example instance of PaginatedResults with DocSearchResult.
 * Strictly for use in testing.
 */
export const testPaginatedResultsDocSearchResult1: PaginatedResults<DocSearchResult> =
  {
    ...testOffsetAndLimit1,
    total: 2,
    results: [testDocSearchResult1, testDocSearchResult2],
  };

/**
 * An example instance of PaginatedResults with QnaSearchResult.
 * Strictly for use in testing.
 */
export const testPaginatedResultsQnaSearchResult1: PaginatedResults<QnaSearchResult> =
  {
    ...testOffsetAndLimit1,
    total: 1,
    results: [testQnaSearchResult1],
  };

/**
 * An example instance of OrgSearchResultsDto.
 * Strictly for use in testing.
 */
export const testOrgSearchResultsDto1 = new OrgSearchResultsDto();
Object.assign(testOrgSearchResultsDto1, testOrgSearchDto1);
testOrgSearchResultsDto1.total = 1;
testOrgSearchResultsDto1.results = [testTeamSearchResult1];

/**
 * An example instance of AppSearchResultsDto.
 * Strictly for use in testing.
 */
export const testAppSearchResultsDto1 = new AppSearchResultsDto();
Object.assign(testAppSearchResultsDto1, testAppSearchDto1);
testAppSearchResultsDto1.total = 1;
testAppSearchResultsDto1.results = [testUserSearchResult1];
