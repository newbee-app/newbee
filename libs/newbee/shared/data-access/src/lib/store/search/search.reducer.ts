import { Keyword, QueryResults } from '@newbee/shared/util';
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
  searchResults: QueryResults | null;

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
      (state): SearchState => ({
        ...state,
        searchResults: null,
        pendingSearch: true,
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
      SearchActions.continueSearch,
      (state): SearchState => ({ ...state, pendingContinueSearch: true }),
    ),
    on(
      SearchActions.continueSearchSuccess,
      (state, { results }): SearchState => {
        const { searchResults } = state;

        return {
          ...state,
          pendingContinueSearch: false,
          searchResults: searchResults
            ? {
                ...results,
                results: searchResults.results.concat(results.results),
              }
            : results,
        };
      },
    ),
    on(RouterActions.routerRequest, (): SearchState => initialSearchState),
  ),
});
