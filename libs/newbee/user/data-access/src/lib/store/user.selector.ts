import { httpFeature } from '@newbee/newbee/shared/data-access';
import { createSelector } from '@ngrx/store';
import { userFeature } from './user.reducer';

/**
 * Select the user's authenticators and screen error.
 */
export const selectAuthenticatorsAndScreenError = createSelector(
  userFeature.selectAuthenticators,
  httpFeature.selectScreenError,
  (authenticators, screenError) => ({ authenticators, screenError }),
);
