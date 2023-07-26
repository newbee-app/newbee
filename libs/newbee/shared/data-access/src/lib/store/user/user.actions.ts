import { BaseUpdateUserDto } from '@newbee/shared/data-access';
import { Keyword, User } from '@newbee/shared/util';
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
  },
});
