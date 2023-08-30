import { Keyword, QueryResult } from '@newbee/shared/util';
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
  searchResult: QueryResult | null;

  /**
   * The results of a suggest request.
   */
  suggestions: string[];

  /**
   * Whether the user is waiting for a search request.
   */
  pendingSearch: boolean;

  /**
   * Whether the user is waiting for a suggest request.
   */
  pendingSuggest: boolean;
}

/**
 * The initial value for `SearchState`.
 */
export const initialSearchState: SearchState = {
  searchResult: null,
  suggestions: [],
  pendingSearch: false,
  pendingSuggest: false,
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
        searchResult: null,
        pendingSearch: true,
      })
    ),
    on(
      SearchActions.searchSuccess,
      (state, { result }): SearchState => ({
        ...state,
        searchResult: result,
        pendingSearch: false,
      })
    ),
    on(
      SearchActions.suggest,
      (state): SearchState => ({
        ...state,
        pendingSuggest: true,
      })
    ),
    on(SearchActions.suggestSuccess, (state, { result }): SearchState => {
      const { suggestions } = result;
      return {
        ...state,
        suggestions,
        pendingSuggest: false,
      };
    }),
    on(RouterActions.routerRequest, (): SearchState => initialSearchState)
  ),
});
