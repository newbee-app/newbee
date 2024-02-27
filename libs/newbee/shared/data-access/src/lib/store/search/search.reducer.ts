import { Keyword, OrgSearchResultsDto } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { RouterActions } from '../router';
import { SearchActions } from './search.actions';

/**
 * The piece of state holding search information that's useful app-wide.
 */
export interface SearchState {
  /**
   * The results of a search request.
   */
  searchResults: OrgSearchResultsDto | null;

  /**
   * The results of a suggest request.
   */
  suggestions: string[];

  /**
   * Whether the user is waiting for a search request.
   */
  pendingSearch: boolean;

  /**
   * Whether the user is waiting for a paginated fetch of the current search query.
   */
  pendingContinueSearch: boolean;
}

/**
 * The initial value for `SearchState`.
 */
export const initialSearchState: SearchState = {
  searchResults: null,
  suggestions: [],
  pendingSearch: false,
  pendingContinueSearch: false,
};

/**
 * The reducers and generated selectors for `SearchState`.
 */
export const searchFeature = createFeature({
  name: Keyword.Search,
  reducer: createReducer(
    initialSearchState,
    on(
      SearchActions.search,
      (state, { query }): SearchState => ({
        ...state,
        searchResults: null,
        pendingSearch: !!query.query,
      }),
    ),
    on(
      SearchActions.searchSuccess,
      (state, { results }): SearchState => ({
        ...state,
        searchResults: results,
        pendingSearch: false,
      }),
    ),
    on(SearchActions.suggestSuccess, (state, { results }): SearchState => {
      const { suggestions } = results;
      return {
        ...state,
        suggestions,
      };
    }),
    on(
      SearchActions.continueSearchPending,
      (state): SearchState => ({
        ...state,
        pendingContinueSearch: true,
      }),
    ),
    on(
      SearchActions.continueSearchSuccess,
      (state, { results }): SearchState => ({
        ...state,
        pendingContinueSearch: false,
        searchResults: {
          ...results,
          results: [
            ...(state.searchResults?.results ?? []),
            ...results.results,
          ],
        },
      }),
    ),
    on(RouterActions.routerRequest, (): SearchState => initialSearchState),
  ),
});
