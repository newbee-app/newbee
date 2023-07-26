import { Keyword } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { v4 } from 'uuid';
import { CookieActions } from './cookie.actions';

/**
 * The piece of state holding the necessary information related to cookies, like for app-wide CSRF prevention.
 */
export interface CookieState {
  /**
   * The token to be sent in request headers for CSRF prevention.
   */
  csrfToken: string | null;

  /**
   * The randomly generated secret for the current session, to be used in encrypting the CSRF token on the server.
   */
  sessionSecret: string;
}

/**
 * The initial value for `Cookietate`.
 */
export const initialCookieState: CookieState = {
  csrfToken: null,
  sessionSecret: v4(),
};

/**
 * The reducers and generated selectors for `CookieState`.
 */
export const cookieFeature = createFeature({
  name: Keyword.Cookie,
  reducer: createReducer(
    initialCookieState,
    on(
      CookieActions.initCookiesSuccess,
      (state, { csrfTokenAndDataDto: { csrfToken } }): CookieState => ({
        ...state,
        csrfToken,
      })
    )
  ),
});
