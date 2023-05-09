import { UserRelation } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { CookieActions } from '../cookie';
import { AuthActions } from './auth.actions';

/**
 * The piece of state holding authentication information that's useful app-wide.
 */
export interface AuthState {
  /**
   * The user's information.
   */
  userRelation: UserRelation | null;
}

/**
 * The initial value for `AuthState`.
 */
export const initialAuthState: AuthState = {
  userRelation: null,
};

/**
 * The reducers and generated selectors for `AuthState`.
 */
export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.registerWithWebauthnSuccess,
      (state, { userRelationAndOptionsDto: { userRelation } }): AuthState => ({
        ...state,
        userRelation,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state, { userRelation }): AuthState => ({
        ...state,
        userRelation,
      })
    ),
    on(
      CookieActions.initCookiesSuccess,
      (state, { csrfTokenAndDataDto: { userRelation } }): AuthState => ({
        ...state,
        userRelation,
      })
    )
  ),
});
