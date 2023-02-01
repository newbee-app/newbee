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
