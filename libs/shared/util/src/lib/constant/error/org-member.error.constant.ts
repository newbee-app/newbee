// Details all of the errors the `org-member` portion of the backend can throw.

/**
 * Constant to say that the user is already a member of the organization.
 */
export const userAlreadyOrgMemberBadRequest =
  'The provided user is already a member of the given organization.';

/**
 * Constant to say that the user could not be found in the organization.
 */
export const orgMemberNotFound = `The specified user is not a member the given organization.`;
