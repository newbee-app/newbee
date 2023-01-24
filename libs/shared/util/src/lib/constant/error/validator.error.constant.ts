// Details all of the errors that `class-validator` can throw from backend DTOs.

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
 * Constant to say that credential is required.
 */
export const credentialIsDefined = 'Credential is required.';

/**
 * Constant to say that name cannot be an empty string.
 */
export const nameIsNotEmpty = 'Name cannot be an empty string.';

/**
 * Constant to say that display name cannot be an empty string.
 */
export const displayNameIsNotEmpty = 'Display name cannot be an empty string.';

/**
 * Constant to say that the active field must be a boolean value.
 */
export const activeIsBoolean = 'Active must be true or false.';

/**
 * Constant to say that the online field must be a boolean value.
 */
export const onlineIsBoolean = 'Online must be true or false.';