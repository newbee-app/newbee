import { Keyword, QueryResult } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
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
}

/**
 * The initial value for `SearchState`.
 */
export const initialSearchState: SearchState = {
  searchResult: null,
  suggestions: [],
};

/**
 * The reducers and generated selectors for `SearchState`.
 */
export const searchFeature = createFeature({
  name: Keyword.Search,
  reducer: createReducer(
    initialSearchState,
    on(
      SearchActions.searchSuccess,
      (state, { result }): SearchState => ({
        ...state,
        suggestions: [],
        searchResult: result,
      })
    ),
    on(SearchActions.suggestSuccess, (state, { result }): SearchState => {
      const { suggestions } = result;
      return {
        ...state,
        suggestions,
      };
    })
  ),
});
