// Details all of the errors the `team` portion of the backend can throw.

/**
 * Constant to say that a team with the given name is already taken.
 */
export const teamNameTakenBadRequest =
  'The provided team name is already taken, please use a different name.';

/**
 * Constant to say that a team with the given name could not be found.
 */
export const teamNameNotFound =
  'We could not find a team associated with the provided name. Please check the name value and try again.';
