/**
 * Constant to describe a forbidden error.
 */
export const forbiddenError =
  'You do not have the permissions to do this. Please contact an admin about your permissions if you think this is an error.';

/**
 * Constant to describe a forbidden error from a user's email being unverified.
 */
export const emailUnverifiedForbiddenError =
  'You must verify your email to regain access to this resource. Please ensure that your email is verified before trying again.';

// START: cookie

// TODO: flesh out this error to actually give users an idea of what to do if they encounter it
/**
 * Constant to say that the provided CSRF token is invalid.
 */
export const csrfTokenInvalidForbidden =
  'We could not validate your CSRF token.';

// END: cookie
