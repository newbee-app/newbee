import {
  OrgRoleEnum,
  TeamRoleEnum,
  testAuthenticationCredential1,
  testDoc1,
  testOrganization1,
  testOrganizationRelation1,
  testOrgMember1,
  testOrgMemberRelation1,
  testPublicKeyCredentialCreationOptions1,
  testQna1,
  testQueryResult1,
  testRegistrationResponse1,
  testTeam1,
  testTeamMember1,
  testTeamQueryResult1,
  testTeamRelation1,
  testUser1,
  testUser2,
  testUserRelation1,
} from '@newbee/shared/util';
import {
  BaseCreateDocDto,
  BaseCreateOrganizationDto,
  BaseCreateOrgMemberInviteDto,
  BaseCreateQnaDto,
  BaseCreateTeamDto,
  BaseCreateTeamMemberDto,
  BaseCreateUserDto,
  BaseCsrfTokenAndDataDto,
  BaseEmailDto,
  BaseGeneratedSlugDto,
  BaseGenerateSlugDto,
  BaseMagicLinkLoginDto,
  BaseNameDto,
  BaseOrgAndMemberDto,
  BaseQueryDto,
  BaseQueryResultDto,
  BaseRegistrationResponseDto,
  BaseSlugDto,
  BaseSlugTakenDto,
  BaseSuggestDto,
  BaseSuggestResultDto,
  BaseTeamAndMemberDto,
  BaseTeamSlugDto,
  BaseTokenDto,
  BaseUpdateAnswerDto,
  BaseUpdateDocDto,
  BaseUpdateOrganizationDto,
  BaseUpdateOrgMemberDto,
  BaseUpdateQnaDto,
  BaseUpdateQuestionDto,
  BaseUpdateTeamDto,
  BaseUpdateTeamMemberDto,
  BaseUpdateUserDto,
  BaseUserRelationAndOptionsDto,
  BaseWebAuthnLoginDto,
} from '../dto';

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
  docMarkdoc: testDoc1.docMarkdoc,
  upToDateDuration: null,
};

/**
 * An example instance of BaseUpdateDocDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateDocDto1: BaseUpdateDocDto = {
  title: 'New title',
  docMarkdoc: 'new raw markdoc',
  upToDateDuration: 'P1Y',
};

/**
 * An example instance of BaseCreateQnaDto.
 * Strictly for use in testing.
 */
export const testBaseCreateQnaDto1: BaseCreateQnaDto = {
  title: testQna1.title,
  questionMarkdoc: testQna1.questionMarkdoc as string,
  answerMarkdoc: testQna1.answerMarkdoc,
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
};

/**
 * An example instance of BaseUpdateQuestionDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateQuestionDto1: BaseUpdateQuestionDto = {
  title: 'New title',
  questionMarkdoc: 'new question',
};

/**
 * An example instance of BaseUpdateAnswerDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateAnswerDto1: BaseUpdateAnswerDto = {
  answerMarkdoc: 'new answer',
  upToDateDuration: 'P1Y',
};

/**
 * An example instance of BaseTeamSlugDto.
 * Strictly for use in testing.
 */
export const testBaseTeamSlugDto1: BaseTeamSlugDto = {
  team: testTeam1.slug,
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
  suggestions: [`<strong>${testTeamQueryResult1.name}</strong>`],
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
