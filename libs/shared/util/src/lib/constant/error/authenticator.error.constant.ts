// Details all of the errors the `authenticator` portion of the backend can throw.

/**
 * Constant to say that an authenticator with the given ID could not be found.
 */
export const authenticatorIdNotFound =
  'We could not find an authenticator associated with the provided ID. Please check the ID value and try again.';

/**
 * Constant to say than an authenticator with the given credential ID could not be found.
 */
export const authenticatorCredentialIdNotFound =
  'We could not find an authenticator associated with the provided credential ID. Please check the ID value and try again.';

/**
 * Constant to say that an authenticator could not be verified.
 */
export const authenticatorVerifyBadRequest =
  'We could not verify this authenticator, please ensure you are using a previously registered authenticator and try again.';

/**
 * Constant to say that an authenticator has already been registered.
 */
export const authenticatorTakenBadRequest =
  'The authenticator you are trying to register has already been registered to an account.';
