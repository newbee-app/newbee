import { User } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

/**
 * The piece of state holding authentication information that's useful app-wide.
 */
export interface AuthState {
  /**
   * The user's information.
   */
  user: User | null;
}

/**
 * The initial value for `AuthState`.
 */
export const initialAuthState: AuthState = {
  user: null,
};

/**
 * The reducers and generated selectors for `AuthState`.
 */
export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.postWebauthnRegisterChallengeSuccess,
      (state, { userAndOptionsDto: { user } }): AuthState => ({
        ...state,
        user,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state, { user }): AuthState => ({
        ...state,
        user,
      })
    )
  ),
});
