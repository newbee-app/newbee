import { createSelector } from '@ngrx/store';
import { httpFeature } from '../http';
import { cookieFeature } from './cookie.reducer';

/**
 * Select the current csrf token and screen error.
 */
export const selectCsrfTokenAndScreenError = createSelector(
  cookieFeature.selectCsrfToken,
  httpFeature.selectScreenError,
  (csrfToken, screenError) => ({ csrfToken, screenError }),
);
