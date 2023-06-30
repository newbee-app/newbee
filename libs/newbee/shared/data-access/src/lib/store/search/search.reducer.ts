import {
  BaseQueryResultDto,
  BaseSuggestResultDto,
  UrlEndpoint,
} from '@newbee/shared/data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SearchActions } from './search.actions';

/**
 * The piece of state holding search information that's useful app-wide.
 */
export interface SearchState {
  /**
   * The results of a search request.
   */
  searchResult: BaseQueryResultDto | null;

  /**
   * The results of a suggest request.
   */
  suggestResult: BaseSuggestResultDto | null;
}

/**
 * The initial value for `SearchState`.
 */
export const initialSearchState: SearchState = {
  searchResult: null,
  suggestResult: null,
};

/**
 * The reducers and generated selectors for `SearchState`.
 */
export const searchFeature = createFeature({
  name: UrlEndpoint.Search,
  reducer: createReducer(
    initialSearchState,
    on(
      SearchActions.searchSuccess,
      (state, { result }): SearchState => ({
        ...state,
        suggestResult: null,
        searchResult: result,
      })
    ),
    on(
      SearchActions.suggestSuccess,
      (state, { result }): SearchState => ({
        ...state,
        suggestResult: result,
      })
    )
  ),
});
