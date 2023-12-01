import { createSelector } from '@ngrx/store';
import { cookieFeature } from '../cookie/cookie.reducer';
import { authFeature } from './auth.reducer';

/**
 * A selector for selecting the current user and CSRF token.
 */
export const selectUserAndCsrfToken = createSelector(
  authFeature.selectUser,
  cookieFeature.selectCsrfToken,
  (user, csrfToken) => ({ user, csrfToken }),
);
