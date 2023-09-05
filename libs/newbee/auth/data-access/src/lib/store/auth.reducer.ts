import {
  AuthActions,
  HttpActions,
  RouterActions,
} from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';

/**
 * Module-specific piece of state related to authentication.
 */
export interface AuthState {
  /**
   * The JWT ID for the magic link sent to a user's email during magic link login.
   */
  jwtId: string | null;

  /**
   * The email a magic link was sent to during magic link login.
   */
  email: string | null;

  /**
   * Whether the user is waiting for a response for magic link login.
   */
  pendingMagicLink: boolean;

  /**
   * Whether the user is waiting for a response for WebAuthn login or register.
   */
  pendingWebAuthn: boolean;
}

/**
 * The initial value for `AuthState`.
 */
export const initialAuthState: AuthState = {
  jwtId: null,
  email: null,
  pendingMagicLink: false,
  pendingWebAuthn: false,
};

/**
 * The reducers and generated selectors for `AuthState`.
 */
export const authFeature = createFeature({
  name: `${Keyword.Auth}Module`,
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.sendLoginMagicLink,
      (state): AuthState => ({
        ...state,
        pendingMagicLink: true,
      }),
    ),
    on(
      AuthActions.sendLoginMagicLinkSuccess,
      (state, { magicLinkLoginDto: { jwtId, email } }): AuthState => ({
        ...state,
        jwtId,
        email,
        pendingMagicLink: false,
      }),
    ),
    on(
      AuthActions.registerWithWebAuthn,
      (state): AuthState => ({
        ...state,
        pendingWebAuthn: true,
      }),
    ),
    on(
      AuthActions.createWebAuthnLoginOptions,
      (state): AuthState => ({
        ...state,
        pendingWebAuthn: true,
      }),
    ),
    on(
      AuthActions.loginSuccess,
      HttpActions.clientError,
      RouterActions.routerRequest,
      (): AuthState => initialAuthState,
    ),
  ),
});
