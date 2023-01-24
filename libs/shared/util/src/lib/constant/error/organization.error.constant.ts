// Details all of the errors the `organization` portion of the backend can throw.

/**
 * Constant to say that an organization with the given name is already taken.
 */
export const organizationNameTakenBadRequest =
  'The provided organization name is already taken, please use a different name.';

/**
 * Constant to say that an organization with the given name could not be found.
 */
export const organizationNameNotFound =
  'We could not find an organization associated with the provided name. Please check the name value and try again.';
