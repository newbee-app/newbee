// Details all of the errors the `org-member-invite` portion of the backend can throw.

/**
 * Constant to say that the user has already been invited to join the organization.
 */
export const orgMemberInvitedBadRequest =
  'This user has already been invited to join the organization.';

/**
 * Constant to say that the user is already a member of the organization.
 */
export const orgMemberAlreadyBadRequest =
  'This user is already a member of the organization.';

/**
 * Constant to say that an organization invite with the given token could not be found.
 */
export const orgMemberInviteTokenNotFound =
  'We could not find an invite associated with the provided token. Please check the token value and try again.';
