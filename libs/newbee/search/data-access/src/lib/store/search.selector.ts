import { httpFeature, searchFeature } from '@newbee/newbee/shared/data-access';
import { createSelector } from '@ngrx/store';

/**
 * Selector for selecting the search result and screen error.
 */
export const selectSearchResultAndScreenError = createSelector(
  searchFeature.selectSearchResult,
  httpFeature.selectScreenError,
  (searchResult, screenError) => ({ searchResult, screenError }),
);
