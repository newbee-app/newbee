// Details all of the errors the `user-challenge` portion of the backend can throw.

/**
 * Constant to say that a challenge for the user with the given ID could not be found.
 */
export const userChallengeIdNotFound =
  'We could not find a challenge associated with the provided user ID. Please check the ID value and try again.';

/**
 * Constant to say that a challenge for the user with the given email could not be found.
 */
export const userChallengeEmailNotFound =
  'We could not find a challenge associated with the provided user email. Please check the email value and try again.';
