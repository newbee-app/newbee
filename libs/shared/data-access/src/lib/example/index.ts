import {
  testAuthenticationCredential1,
  testDoc1,
  testOrganization1,
  testPublicKeyCredentialCreationOptions1,
  testQna1,
  testRegistrationResponse1,
  testSuggestion1,
  testTeam1,
  testTeamQueryResult1,
  testUser1,
} from '@newbee/shared/util';
import {
  BaseCreateDocDto,
  BaseCreateOrganizationDto,
  BaseCreateQnaDto,
  BaseCreateTeamDto,
  BaseCreateUserDto,
  BaseCsrfTokenDto,
  BaseEmailDto,
  BaseMagicLinkLoginDto,
  BaseQueryDto,
  BaseQueryResultDto,
  BaseRegistrationResponseDto,
  BaseSuggestDto,
  BaseSuggestResultDto,
  BaseTeamSlugDto,
  BaseUpdateAnswerDto,
  BaseUpdateDocDto,
  BaseUpdateOrganizationDto,
  BaseUpdateQnaDto,
  BaseUpdateQuestionDto,
  BaseUpdateTeamDto,
  BaseUpdateUserDto,
  BaseUserAndOptionsDto,
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
export const testBaseUserAndOptionsDto1: BaseUserAndOptionsDto = {
  user: testUser1,
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
export const testBaseCsrfTokenDto1: BaseCsrfTokenDto = {
  csrfToken: 'csrf1',
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
  email: testUser1.email,
  name: 'Jane Doe',
};

/**
 * An example instance of BaseCreateOrganizationDto.
 * Strictly for use in testing.
 */
export const testBaseCreateOrganizationDto1: BaseCreateOrganizationDto = {
  ...testOrganization1,
};

/**
 * An example instance of BaseUpdateOrganizationDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateOrganizationDto1: BaseUpdateOrganizationDto = {
  name: 'NewWasp',
  slug: 'new-wasp',
};

/**
 * An example instance of BaseCreateTeamDto.
 * Strictly for use in testing.
 */
export const testBaseCreateTeamDto1: BaseCreateTeamDto = {
  name: testTeam1.name,
  slug: testTeam1.slug,
};

/**
 * An example instance of BaseUpdateTeamDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateTeamDto1: BaseUpdateTeamDto = {
  name: 'Human Resources',
  slug: 'human-resources',
};

/**
 * An example instance of BaseCreateDocDto.
 * Strictly for use in testing.
 */
export const testBaseCreateDocDto1: BaseCreateDocDto = {
  title: testDoc1.title,
  docMarkdoc: testDoc1.docMarkdoc,
};

/**
 * An example instance of BaseUpdateDocDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateDocDto1: BaseUpdateDocDto = {
  title: 'New title',
  docMarkdoc: 'new raw markdoc',
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
};

/**
 * An example instance of BaseTeamSlugDto.
 * Strictly for use in testing.
 */
export const testBaseTeamSlugDto1: BaseTeamSlugDto = {
  team: testTeam1.slug,
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
  query: 'query',
};

/**
 * An example instance of BaseQueryDto.
 * Strictly for use in testing.
 */
export const testBaseQueryDto1: BaseQueryDto = {
  query: 'query',
  offset: 0,
};

/**
 * An example instance of BaseSuggestResultDto.
 * Strictly for use in testing.
 */
export const testBaseSuggestResultDto1: BaseSuggestResultDto = {
  suggestions: [testSuggestion1.term],
};

/**
 * An example instance of BaseQueryResultDto.
 * Strictly for use in testing.
 */
export const testBaseQueryResultDto1: BaseQueryResultDto = {
  team: {
    offset: testBaseQueryDto1.offset,
    results: [testTeamQueryResult1],
  },
};
