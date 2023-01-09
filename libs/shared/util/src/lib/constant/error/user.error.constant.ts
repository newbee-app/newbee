// Details all of the errors the `user` portion of the backend can throw.

/**
 * Constant to say that a user with the given ID could not be found.
 */
export const userIdNotFound =
  'We could not find a user associated with the provided ID. Please check the ID value and try again.';

/**
 * Constant to say that a user with the given email could not be found.
 */
export const userEmailNotFound =
  'We could not find a user associated with the provided email. Please check the email value and try again.';

/**
 * Constant to say that the given user email is already taken.
 */
export const userEmailTakenBadRequest =
  'The provided email is already taken, please use a different email or log in to your existing account.';
