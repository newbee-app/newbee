import { AuthActions } from '@newbee/newbee/shared/data-access';
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
}

/**
 * The initial value for `AuthState`.
 */
export const initialAuthState: AuthState = {
  jwtId: null,
  email: null,
};

/**
 * The reducers and generated selectors for `AuthState`.
 */
export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.sendLoginMagicLinkSuccess,
      (state, { magicLinkLoginDto: { jwtId, email } }): AuthState => ({
        ...state,
        jwtId,
        email,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state): AuthState => ({
        ...state,
        jwtId: null,
        email: null,
      })
    )
  ),
});
