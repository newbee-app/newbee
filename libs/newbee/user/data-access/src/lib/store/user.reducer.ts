import {
  AuthenticatorActions,
  HttpActions,
  RouterActions,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import type { Authenticator } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific state related to the user.
 */
export interface UserState {
  /**
   * The authenticators associated with the user.
   */
  authenticators: Authenticator[] | null;

  /**
   * Whether the user is waiting for a response for editing user details.
   */
  pendingEdit: boolean;

  /**
   * Whether the user is waiting for a response for adding an authenticator.
   */
  pendingAddAuthenticator: boolean;

  /**
   * Whether the user is waiting for a response for editing an authenticator's name.
   */
  pendingEditAuthenticator: boolean[] | null;

  /**
   * Whether the user is waiting for a response for deleting a user.
   */
  pendingDelete: boolean;
}

/**
 * The initial value for `UserState`.
 */
export const initialUserState: UserState = {
  authenticators: null,
  pendingEdit: false,
  pendingAddAuthenticator: false,
  pendingEditAuthenticator: null,
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
      AuthenticatorActions.getAuthenticatorsSuccess,
      (state, { authenticators }): UserState => ({
        ...state,
        authenticators,
        pendingEditAuthenticator: authenticators.map(() => false),
      })
    ),
    on(
      AuthenticatorActions.createRegistrationOptions,
      (state): UserState => ({
        ...state,
        pendingAddAuthenticator: true,
      })
    ),
    on(
      AuthenticatorActions.createAuthenticatorSuccess,
      (state, { authenticator }): UserState => ({
        ...state,
        pendingAddAuthenticator: false,
        authenticators: [authenticator, ...(state.authenticators ?? [])],
        pendingEditAuthenticator: [
          false,
          ...(state.pendingEditAuthenticator ?? []),
        ],
      })
    ),
    on(
      UserActions.editUserSuccess,
      (state): UserState => ({
        ...initialUserState,
        authenticators: state.authenticators,
        pendingEditAuthenticator: state.pendingEditAuthenticator,
      })
    ),
    on(
      HttpActions.clientError,
      (state): UserState => ({
        ...initialUserState,
        authenticators: state.authenticators,
        pendingEditAuthenticator:
          state.authenticators && state.authenticators.map(() => false),
      })
    ),
    on(
      UserActions.deleteUserSuccess,
      RouterActions.routerRequest,
      (): UserState => initialUserState
    )
  ),
});
