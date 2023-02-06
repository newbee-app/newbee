import {
  testAuthenticationCredential1,
  testDoc1,
  testOrganization1,
  testPublicKeyCredentialCreationOptions1,
  testQna1,
  testTeam1,
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
  BaseTeamNameDto,
  BaseUpdateDocDto,
  BaseUpdateOrganizationDto,
  BaseUpdateQnaDto,
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
  name: testOrganization1.name,
  displayName: testOrganization1.displayName,
};

/**
 * An example instance of BaseUpdateOrganizationDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateOrganizationDto1: BaseUpdateOrganizationDto = {
  name: 'NewWasp',
  displayName: 'Waspy',
};

/**
 * An example instance of BaseCreateTeamDto.
 * Strictly for use in testing.
 */
export const testBaseCreateTeamDto1: BaseCreateTeamDto = {
  name: testTeam1.name,
  displayName: testTeam1.displayName,
};

/**
 * An example instance of BaseUpdateTeamDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateTeamDto1: BaseUpdateTeamDto = {
  name: 'Human Resources',
  displayName: 'HR',
};

/**
 * An example instance of BaseCreateDocDto.
 * Strictly for use in testing.
 */
export const testBaseCreateDocDto1: BaseCreateDocDto = {
  slug: testDoc1.slug,
  rawMarkdown: testDoc1.rawMarkdown,
};

/**
 * An example instance of BaseUpdateDocDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateDocDto1: BaseUpdateDocDto = {
  slug: 'new-title',
  rawMarkdown: 'new raw markdown',
};

/**
 * An example instance of BaseCreateQnaDto.
 * Strictly for use in testing.
 */
export const testBaseCreateQnaDto1: BaseCreateQnaDto = {
  slug: testQna1.slug,
  questionMarkdown: testQna1.questionMarkdown,
  answerMarkdown: testQna1.answerMarkdown,
};

/**
 * An example instance of BaseUpdateQnaDto.
 * Strictly for use in testing.
 */
export const testBaseUpdateQnaDto1: BaseUpdateQnaDto = {
  slug: 'new-title',
  questionMarkdown: 'new question',
  answerMarkdown: 'new answer',
};

/**
 * An example instance of BaseTeamNameDto.
 * Strictly for use in testing.
 */
export const testBaseTeamNameDto1: BaseTeamNameDto = {
  teamName: testTeam1.name,
};
