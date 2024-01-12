import { httpFeature, searchFeature } from '@newbee/newbee/shared/data-access';
import { createSelector } from '@ngrx/store';

/**
 * Selector for selecting the search results and screen error.
 */
export const selectSearchResultsAndScreenError = createSelector(
  searchFeature.selectSearchResults,
  httpFeature.selectScreenError,
  (searchResults, screenError) => ({
    searchResults,
    screenError,
  }),
);
