import {
  AuthenticatorActions,
  HttpActions,
  RouterActions,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import { Authenticator, Keyword } from '@newbee/shared/util';
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
  pendingEditAuthenticator: Set<string>;

  /**
   * Whether the user is waiting for a response for deleting an authenticator.
   */
  pendingDeleteAuthenticator: Set<string>;

  /**
   * Whether the user is waiting for a response for deleting a user.
   */
  pendingDelete: boolean;

  /**
   * Whether the user is waiting for a response for sending a verification email.
   */
  pendingSendVerificationEmail: boolean;
}

/**
 * The initial value for `UserState`.
 */
export const initialUserState: UserState = {
  authenticators: null,
  pendingEdit: false,
  pendingAddAuthenticator: false,
  pendingEditAuthenticator: new Set(),
  pendingDeleteAuthenticator: new Set(),
  pendingDelete: false,
  pendingSendVerificationEmail: false,
};

/**
 * The reducers and generated selectors for `UserState`.
 */
export const userFeature = createFeature({
  name: `${Keyword.User}Module`,
  reducer: createReducer(
    initialUserState,
    on(
      UserActions.editUser,
      (state): UserState => ({
        ...state,
        pendingEdit: true,
      }),
    ),
    on(
      UserActions.deleteUser,
      (state): UserState => ({
        ...state,
        pendingDelete: true,
      }),
    ),
    on(
      AuthenticatorActions.getAuthenticatorsSuccess,
      (_state, { authenticators }): UserState => ({
        ...initialUserState,
        authenticators,
      }),
    ),
    on(
      AuthenticatorActions.createRegistrationOptions,
      (state): UserState => ({
        ...state,
        pendingAddAuthenticator: true,
      }),
    ),
    on(
      AuthenticatorActions.createAuthenticatorSuccess,
      (state, { authenticator }): UserState => {
        return {
          ...state,
          pendingAddAuthenticator: false,
          authenticators: [authenticator, ...(state.authenticators ?? [])],
        };
      },
    ),
    on(
      AuthenticatorActions.editAuthenticatorName,
      (state, { id }): UserState => {
        const pendingEditAuthenticator = new Set(
          state.pendingEditAuthenticator,
        );
        pendingEditAuthenticator.add(id);

        return { ...state, pendingEditAuthenticator };
      },
    ),
    on(
      AuthenticatorActions.editAuthenticatorNameSuccess,
      (state, { authenticator }): UserState => {
        const pendingEditAuthenticator = new Set(
          state.pendingEditAuthenticator,
        );
        pendingEditAuthenticator.delete(authenticator.id);

        return {
          ...state,
          authenticators:
            state.authenticators?.map((curr) =>
              curr.id === authenticator.id ? authenticator : curr,
            ) ?? null,
          pendingEditAuthenticator,
        };
      },
    ),
    on(AuthenticatorActions.deleteAuthenticator, (state, { id }): UserState => {
      const pendingDeleteAuthenticator = new Set(
        state.pendingDeleteAuthenticator,
      );
      pendingDeleteAuthenticator.add(id);

      return {
        ...state,
        pendingDeleteAuthenticator,
      };
    }),
    on(
      AuthenticatorActions.deleteAuthenticatorSuccess,
      (state, { id }): UserState => {
        const pendingEditAuthenticator = new Set(
          state.pendingEditAuthenticator,
        );
        const pendingDeleteAuthenticator = new Set(
          state.pendingDeleteAuthenticator,
        );
        pendingEditAuthenticator.delete(id);
        pendingDeleteAuthenticator.delete(id);

        return {
          ...state,
          authenticators:
            state.authenticators?.filter(
              (authenticator) => authenticator.id !== id,
            ) ?? null,
          pendingEditAuthenticator,
          pendingDeleteAuthenticator,
        };
      },
    ),
    on(
      UserActions.editUserSuccess,
      (state): UserState => ({
        ...state,
        pendingEdit: false,
      }),
    ),
    on(
      UserActions.sendVerificationEmail,
      (state): UserState => ({
        ...state,
        pendingSendVerificationEmail: true,
      }),
    ),
    on(
      UserActions.sendVerificationEmailSuccess,
      (state): UserState => ({
        ...state,
        pendingSendVerificationEmail: false,
      }),
    ),
    on(HttpActions.clientError, (state): UserState => {
      return {
        ...initialUserState,
        authenticators: state.authenticators,
      };
    }),
    on(
      UserActions.deleteUserSuccess,
      RouterActions.routerRequest,
      (): UserState => initialUserState,
    ),
  ),
});
