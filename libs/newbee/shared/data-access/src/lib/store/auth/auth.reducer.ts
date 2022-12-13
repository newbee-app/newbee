import { User } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { AuthActions } from './auth.actions';

/**
 * The piece of state holding authentication information that's useful app-wide.
 */
export interface AuthState {
  /**
   * The access token to be sent in request headers, representing an authenticated user.
   */
  accessToken: string | null;

  /**
   * The user's information.
   */
  user: User | null;
}

/**
 * The initial value for `AuthState`.
 */
export const initialAuthState: AuthState = {
  accessToken: null,
  user: null,
};

/**
 * The reducers and generated selectors for `AuthState`.
 */
export const authFeature = createFeature<AppState, 'auth'>({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.getWebauthnRegisterChallengeSuccess,
      (state, { userCreatedDto: { access_token, user } }): AuthState => ({
        ...state,
        accessToken: access_token,
        user,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state, { loginDto: { access_token, user } }): AuthState => ({
        ...state,
        accessToken: access_token,
        user,
      })
    )
  ),
});
