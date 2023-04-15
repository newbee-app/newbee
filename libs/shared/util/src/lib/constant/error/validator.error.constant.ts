// Details all of the errors that `class-validator` can throw from backend DTOs.

import { OrgRoleEnum, SolrEntryEnum } from '../../enum';

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
 * Constant to say that a doc cannot be empty.
 */
export const docIsNotEmpty = 'You cannot save an empty doc.';

/**
 * Constant to say that a question cannot be empty.
 */
export const questionIsNotEmpty = 'You cannot save an empty question.';

/**
 * Constant to say that an answer cannot be empty.
 */
export const answerIsNotEmpty = 'You cannot save an empty answer.';

/**
 * Constant to say that query cannot be an empty string.
 */
export const queryIsNotEmpty = 'Query cannot be an empty string.';

/**
 * Constant to say that token cannot be an empty string.
 */
export const tokenIsNotEmpty = 'Token cannot be an empty string.';

/**
 * Constant to say that the active field must be a boolean value.
 */
export const activeIsBoolean = 'Active must be true or false.';

/**
 * Constant to say that the online field must be a boolean value.
 */
export const onlineIsBoolean = 'Online must be true or false.';

/**
 * Constant to say that offset must be an int.
 */
export const offsetIsInt = 'Offset must be an int.';

/**
 * Constant to say that offset has a min of 0.
 */
export const offsetMin0 = 'Offset cannot be less than 0.';

/**
 * Constant to say that the value for type must be in SolrEntryEnum.
 */
export const typeIsEnum = `Type can only be one of the following values: ${Object.values(
  SolrEntryEnum
)}`;

/**
 * Constant to say that the value for orgRole must be in OrgRoleEnum.
 */
export const orgRoleIsEnum = `Type can only be one of the following values: ${Object.values(
  OrgRoleEnum
)}`;
