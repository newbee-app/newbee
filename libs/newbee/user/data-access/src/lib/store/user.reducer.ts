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
  pendingEditAuthenticator: Map<string, boolean>;

  /**
   * Whether the user is waiting for a response for deleting an authenticator.
   */
  pendingDeleteAuthenticator: Map<string, boolean>;

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
  pendingEditAuthenticator: new Map(),
  pendingDeleteAuthenticator: new Map(),
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
      (state, { authenticators }): UserState => {
        const pendingEditAuthenticator = new Map<string, boolean>();
        const pendingDeleteAuthenticator = new Map<string, boolean>();
        authenticators.forEach((authenticator) => {
          const { id } = authenticator;
          pendingEditAuthenticator.set(id, false);
          pendingDeleteAuthenticator.set(id, false);
        });

        return {
          ...state,
          authenticators,
          pendingEditAuthenticator,
          pendingDeleteAuthenticator,
        };
      }
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
      (state, { authenticator }): UserState => {
        const { id } = authenticator;
        const pendingEditAuthenticator = new Map(
          state.pendingEditAuthenticator
        );
        const pendingDeleteAuthenticator = new Map(
          state.pendingDeleteAuthenticator
        );
        pendingEditAuthenticator.set(id, false);
        pendingDeleteAuthenticator.set(id, false);

        return {
          ...state,
          pendingAddAuthenticator: false,
          authenticators: [authenticator, ...(state.authenticators ?? [])],
          pendingEditAuthenticator,
          pendingDeleteAuthenticator,
        };
      }
    ),
    on(
      AuthenticatorActions.editAuthenticatorName,
      (state, { id }): UserState => {
        const pendingEditAuthenticator = new Map(
          state.pendingEditAuthenticator
        );
        pendingEditAuthenticator.set(id, true);

        return { ...state, pendingEditAuthenticator };
      }
    ),
    on(
      AuthenticatorActions.editAuthenticatorNameSuccess,
      (state, { authenticator }): UserState => {
        const pendingEditAuthenticator = new Map(
          state.pendingEditAuthenticator
        );
        pendingEditAuthenticator.set(authenticator.id, false);

        return {
          ...state,
          authenticators:
            state.authenticators?.map((curr) =>
              curr.id === authenticator.id ? authenticator : curr
            ) ?? null,
          pendingEditAuthenticator,
        };
      }
    ),
    on(AuthenticatorActions.deleteAuthenticator, (state, { id }): UserState => {
      const pendingDeleteAuthenticator = new Map(
        state.pendingDeleteAuthenticator
      );
      pendingDeleteAuthenticator.set(id, true);

      return {
        ...state,
        pendingDeleteAuthenticator,
      };
    }),
    on(
      AuthenticatorActions.deleteAuthenticatorSuccess,
      (state, { id }): UserState => {
        const pendingEditAuthenticator = new Map(
          state.pendingEditAuthenticator
        );
        const pendingDeleteAuthenticator = new Map(
          state.pendingDeleteAuthenticator
        );
        pendingEditAuthenticator.delete(id);
        pendingDeleteAuthenticator.delete(id);

        return {
          ...state,
          authenticators:
            state.authenticators?.filter(
              (authenticator) => authenticator.id !== id
            ) ?? null,
          pendingEditAuthenticator,
          pendingDeleteAuthenticator,
        };
      }
    ),
    on(
      UserActions.editUserSuccess,
      (state): UserState => ({
        ...state,
        pendingEdit: false,
      })
    ),
    on(HttpActions.clientError, (state): UserState => {
      state.pendingEditAuthenticator.clear();
      state.pendingDeleteAuthenticator.clear();
      state.authenticators?.forEach((authenticator) => {
        const { id } = authenticator;
        state.pendingEditAuthenticator.set(id, false);
        state.pendingDeleteAuthenticator.set(id, false);
      });

      return {
        ...initialUserState,
        authenticators: state.authenticators,
        pendingEditAuthenticator: state.pendingEditAuthenticator,
        pendingDeleteAuthenticator: state.pendingDeleteAuthenticator,
      };
    }),
    on(
      UserActions.deleteUserSuccess,
      RouterActions.routerRequest,
      (): UserState => initialUserState
    )
  ),
});
