// Details all of the errors the `organization` portion of the backend can throw.

/**
 * Constant to say that an organization with the given slug is already taken.
 */
export const organizationSlugTakenBadRequest =
  'The provided organization slug is already taken, please use a different slug.';

/**
 * Constant to say that an organization with the given slug could not be found.
 */
export const organizationSlugNotFound =
  'We could not find an organization associated with the provided slug. Please check the slug value and try again.';
