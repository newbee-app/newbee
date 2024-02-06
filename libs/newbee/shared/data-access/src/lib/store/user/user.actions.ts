import { BaseUpdateUserDto, Keyword, User } from '@newbee/shared/util';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * All actions tied to working with user information.
 */
export const UserActions = createActionGroup({
  source: Keyword.User,
  events: {
    /**
     * Edits the current user with the given information.
     */
    'Edit User': props<{ updateUserDto: BaseUpdateUserDto }>(),

    /**
     * Indicates the current user was successfully updated.
     */
    'Edit User Success': props<{ user: User }>(),

    /**
     * Delete the current user.
     */
    'Delete User': emptyProps(),

    /**
     * Indicates the current user was successfully deleted.
     */
    'Delete User Success': emptyProps(),

    /**
     * Verify the email associated with the given token.
     */
    'Verify Email': props<{ token: string }>(),

    /**
     * Indicates that the email associated with the token was successfully verified.
     */
    'Verify Email Success': props<{ user: User }>(),

    /**
     * Send an email to verify the logged-in user's email.
     */
    'Send Verification Email': emptyProps(),

    /**
     * Indicates that a verification email was successfully sent.
     */
    'Send Verification Email Success': emptyProps(),
  },
});
