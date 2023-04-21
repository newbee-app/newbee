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

/**
 * Constant to say that you cannot delete an org member if they are the only owner of the team.
 */
export const cannotDeleteOnlyOrgOwnerBadRequest = `You cannot delete an org member if they are the only owner of the org. You must either delete the entire org or assign a different user to be the team's owner first.`;

/**
 * Constant to say that you cannot delete an org member if they still maintain any posts.
 */
export const cannotDeleteMaintainerBadReqest =
  'You cannot delete an org member if they still maintain any posts. You must either find new maintainers for their posts or explicitly mark the posts as having no maintainer.';
