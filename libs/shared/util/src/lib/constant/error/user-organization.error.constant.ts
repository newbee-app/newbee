// Details all of the errors the `user-organization` portion of the backend can throw.

/**
 * Constant to say that the user is already in the organization.
 */
export const userAlreadyInOrganizationBadRequest =
  'The provided user is already a member of the given organization.';

/**
 * Constant to say that the user could not be found in the organization.
 */
export const userOrganizationNotFound = `The specified user is not associated with the given organization.`;
