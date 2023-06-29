import { UserActions } from '@newbee/newbee/shared/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific state related to the user.
 */
export interface UserState {
  /**
   * Whether the user is waiting for a response for editing user details.
   */
  pendingEdit: boolean;

  /**
   * Whether the user is waiting for a response for deleting a user.
   */
  pendingDelete: boolean;
}

/**
 * The initial value for `UserState`.
 */
export const initialUserState: UserState = {
  pendingEdit: false,
  pendingDelete: false,
};

/**
 * The reducers and generated selectors for `UserState`.
 */
export const userFeature = createFeature({
  name: `${UrlEndpoint.User}Module`,
  reducer: createReducer(
    initialUserState,
    on(
      UserActions.editUser,
      (state): UserState => ({
        ...state,
        pendingEdit: true,
      })
    ),
    on(
      UserActions.deleteUser,
      (state): UserState => ({
        ...state,
        pendingDelete: true,
      })
    ),
    on(
      UserActions.editUserSuccess,
      UserActions.deleteUserSuccess,
      (): UserState => initialUserState
    )
  ),
});
