import type { OrgMemberInviteNoUser, User } from '@newbee/shared/util';
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
  user: User | null;
  /**
   * The pending org member invites for the user, including:
   * - The token and role for the org member invite
   * - The name and slug of the organization the invite is attached to
   */
  invites: OrgMemberInviteNoUser[];
}

/**
 * The initial value for `AuthState`.
 */
export const initialAuthState: AuthState = {
  user: null,
  invites: [],
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
      (
        state,
        {
          userRelationAndOptionsDto: {
            userRelation: { user, invites },
          },
        }
      ): AuthState => ({
        ...state,
        user,
        invites,
      })
    ),
    on(
      AuthActions.loginSuccess,
      (state, { userRelation: { user, invites } }): AuthState => ({
        ...state,
        user,
        invites,
      })
    ),
    on(AuthActions.logoutSuccess, (): AuthState => initialAuthState),
    on(
      CookieActions.initCookiesSuccess,
      (state, { csrfTokenAndDataDto: { userRelation } }): AuthState => {
        if (!userRelation) {
          return state;
        }

        const { user, invites } = userRelation;
        return { ...state, user, invites };
      }
    )
  ),
});
