import {
  httpFeature,
  organizationFeature,
  searchFeature,
} from '@newbee/newbee/shared/data-access';
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

/**
 * Selector for selecting the search results, currently selected org, and error.
 */
export const selectSearchResultsOrgAndError = createSelector(
  searchFeature.selectSearchResults,
  organizationFeature.selectSelectedOrganization,
  httpFeature.selectError,
  (searchResults, selectedOrganization, error) => ({
    searchResults,
    selectedOrganization,
    error,
  }),
);
