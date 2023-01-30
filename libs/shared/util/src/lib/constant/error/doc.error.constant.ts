// Details all of the errors the `doc` portion of the backend can throw.

/**
 * Constant to say that a doc with the given slug is already taken.
 */
export const docSlugTakenBadRequest =
  'The provided doc slug is already taken, please use a different slug.';

/**
 * Constant to say that a doc with the given slug could not be found.
 */
export const docSlugNotFound =
  'We could not find a doc associated with the provided slug. Please check the slug value and try again.';
