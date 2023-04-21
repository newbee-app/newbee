// Details all of the errors the `team-member` portion of the backend can throw.

/**
 * Constant to say that the user is already a member of the team.
 */
export const userAlreadyTeamMemberBadRequest =
  'The provided user is already a member of the given team.';

/**
 * Constant to say that the user could not be found in the team.
 */
export const teamMemberNotFound =
  'The specified user is not a member of the given team.';

/**
 * Constant to say that you cannot delete a team member if they are the only owner of the team.
 */
export const cannotDeleteOnlyTeamOwnerBadRequest = `You cannot delete a team member if they are the only owner of the team. You must either delete the entire team or assign a different user to be the team's owner first.`;
