// Details all of the errors the `team` portion of the backend can throw.

/**
 * Constant to say that a team with the given slug is already taken.
 */
export const teamSlugTakenBadRequest =
  'The provided team slug is already taken, please use a different slug.';

/**
 * Constant to say that a team with the given slug could not be found.
 */
export const teamSlugNotFound =
  'We could not find a team associated with the provided slug. Please check the slug value and try again.';
