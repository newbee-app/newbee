// Details all of the errors that `class-validator` can throw from backend DTOs.

import { OrgRoleEnum, SolrEntryEnum, TeamRoleEnum } from '../../enum';

/**
 * Constant to say that an email address field must specify a valid email address.
 */
export const emailIsEmail = 'Email address must specify a valid email address.';

/**
 * Constant to say that a phone number field must specify a valid phone number.
 */
export const phoneNumberIsPhoneNumber =
  'Phone number must specify a valid phone number.';

/**
 * Constant to say that response is required.
 */
export const responseIsDefined = 'Response is required.';

/**
 * Constant to say that name cannot be an empty string.
 */
export const nameIsNotEmpty = 'Name cannot be an empty string.';

/**
 * Constant to say that display name cannot be an empty string.
 */
export const displayNameIsNotEmpty = 'Display name cannot be an empty string.';

/**
 * Constant to say that title cannot be an empty string.
 */
export const titleIsNotEmpty = 'Title cannot be an empty string.';

/**
 * Constant to say that slug cannot be an empty string.
 */
export const slugIsNotEmpty = 'Slug cannot be an empty string.';

/**
 * Constant to say that doc cannot be an empty string.
 */
export const docIsNotEmpty = 'Doc cannot be an empty string.';

/**
 * Constant to say that question cannot be an empty string.
 */
export const questionIsNotEmpty = 'Question cannot be an empty string.';

/**
 * Constant to say that answer cannot be an empty string.
 */
export const answerIsNotEmpty = 'Answer cannot be an empty string.';

/**
 * Constant to say that team cannot ben an empty string.
 */
export const teamIsNotEmpty = 'Team cannot be an empty string.';

/**
 * Constant to say that query cannot be an empty string.
 */
export const queryIsNotEmpty = 'Query cannot be an empty string.';

/**
 * Constant to say that token cannot be an empty string.
 */
export const tokenIsNotEmpty = 'Token cannot be an empty string.';

/**
 * Constant to say that base cannot be an empty string.
 */
export const baseIsNotEmpty = 'Base cannot be an empty string.';

/**
 * Constant to say that org member cannot be an empty string.
 */
export const orgMemberIsNotEmpty = 'Org member cannot be an empty string.';

/**
 * Constant to say that creator cannot be an empty string.
 */
export const creatorIsNotEmpty = 'Creator cannot be an empty string.';

/**
 * Constant to say that maintainer cannot be an empty string.
 */
export const maintainerIsNotEmpty = 'Maintainer cannot be an empty string';

/**
 * Constant to say that role cannot be an empty string.
 */
export const roleIsNotEmpty = 'Role cannot be an empty string.';

/**
 * Constant to say that up-to-date duration must be an ISO 8601 string.
 */
export const upToDateDurationMatches =
  'Up-to-date duration must be an ISO 8601 duration string.';

/**
 * Constant to say that offset must be an int.
 */
export const offsetIsInt = 'Offset must be an int.';

/**
 * Constant to say that offset must have a min of 0.
 */
export const offsetMin0 = 'Offset cannot be less than 0.';

/**
 * Constant to say that liimit must be an int.
 */
export const limitIsInt = 'Limit must be an int.';

/**
 * Constant to say that limit must have a min of 1.
 */
export const limitMin1 = 'Limit cannot be less than 1.';

/**
 * Constant to say that the value for type must be in SolrEntryEnum.
 */
export const typeIsEnum = `Type can only be one of the following values: ${Object.values(
  SolrEntryEnum,
)}`;

/**
 * Constant to say that the value for orgRole must be in OrgRoleEnum.
 */
export const orgRoleIsEnum = `Type can only be one of the following values: ${Object.values(
  OrgRoleEnum,
)}`;

/**
 * Constant to say that the value of teamRole must be in TeamRoleEnum.
 */
export const teamRoleIsEnum = `Type can only be one of the following values: ${Object.values(
  TeamRoleEnum,
)}`;
