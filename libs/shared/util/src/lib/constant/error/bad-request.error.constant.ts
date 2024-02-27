// START: authenticator

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

// END: authenticator

// Start: doc

/**
 * Constant to say that a doc slug must come with an org slug in the request params.
 */
export const docWithoutOrgBadRequest =
  'We cannot find a doc if you do not specify an org to look in.';

// END: doc

// START: org member invite

/**
 * Constant to say that the user has already been invited to join the organization.
 */
export const orgMemberInvitedBadRequest =
  'This user has already been invited to join the organization.';

// End: org member invite

// START: org member

/**
 * Constant to say that the user is already a member of the organization.
 */
export const orgMemberAlreadyBadRequest =
  'This user is already a member of the organization.';

/**
 * Constant to say that the user is already a member of the organization.
 */
export const userAlreadyOrgMemberBadRequest =
  'The provided user is already a member of the given organization.';

/**
 * Constant to say that you cannot delete an org member if they are the only owner of the team.
 */
export const cannotDeleteOnlyOrgOwnerBadRequest = `You cannot delete an org member if they are the only owner of the org. You must either delete the entire org or assign a different user to be the org's owner first.`;

/**
 * Constant to say that you cannot delete an org member if they still maintain any posts.
 */
export const cannotDeleteMaintainerBadReqest =
  'You cannot delete an org member if they still maintain any posts. You must either find new maintainers for their posts or explicitly mark the posts as having no maintainer.';

// END: org member

// START: organization

/**
 * Constant to say that an organization with the given slug is already taken.
 */
export const organizationSlugTakenBadRequest =
  'The provided organization slug is already taken, please use a different slug.';

// END: organization

// START: qna

/**
 * Constant to say that a qna slug must come with an org slug in the request params.
 */
export const qnaWithoutOrgBadRequest =
  'We cannot find a qna if you do not specify an org to look in.';

// END: qna

// START: team member

/**
 * Constant to say that the user is already a member of the team.
 */
export const userAlreadyTeamMemberBadRequest =
  'The provided user is already a member of the given team.';

/**
 * Constant to say that you cannot delete a team member if they are the only owner of the team.
 */
export const cannotDeleteOnlyTeamOwnerBadRequest = `You cannot delete a team member if they are the only owner of the team. You must either delete the entire team or assign a different user to be the team's owner first.`;

// END: team member

// START: team

/**
 * Constant to say that a team with the given slug is already taken.
 */
export const teamSlugTakenBadRequest =
  'The provided team slug is already taken, please use a different slug.';

/**
 * Constant to say that a team slug must come with an org slug in the request params.
 */
export const teamWithoutOrgBadRequest =
  'We cannot find a team if you do not specify an org to look in.';

// END: team

// START: user

/**
 * Constant to say that the given user email is already taken.
 */
export const userEmailTakenBadRequest =
  'The provided email is already taken, please use a different email.';

// END: user

// START: waitlist member

/**
 * Constant to say that the email is already on the waitlist.
 */
export const alreadyOnWaitlistBadRequest = `You are already on the waitlist and can't sign up for it again. Thank you again for your interest in NewBee. Please keep an eye on your email for when you are accepted off of the waitlist.`;

/**
 * Constant to say that the email is already registered to a user.
 */
export const emailAlreadyRegisteredBadRequest =
  'There is already an account associated with this email. No need to sign up for the waitlist, please log in to your existing account!';

// END: waitlist member
