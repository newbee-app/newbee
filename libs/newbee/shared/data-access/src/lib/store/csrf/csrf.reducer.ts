import { createFeature, createReducer, on } from '@ngrx/store';
import { v4 } from 'uuid';
import { CsrfActions } from './csrf.actions';

/**
 * The piece of state holding the necessary information for app-wide CSRF prevention..
 */
export interface CsrfState {
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
 * The initial value for `CsrfState`.
 */
export const initialCsrfState: CsrfState = {
  csrfToken: null,
  sessionSecret: v4(),
};

/**
 * The reducers and generated selectors for `CsrfState`.
 */
export const csrfFeature = createFeature({
  name: 'csrf',
  reducer: createReducer(
    initialCsrfState,
    on(
      CsrfActions.getCsrfTokenSuccess,
      (state, { csrfTokenDto: { csrfToken } }): CsrfState => ({
        ...state,
        csrfToken,
      })
    )
  ),
});
