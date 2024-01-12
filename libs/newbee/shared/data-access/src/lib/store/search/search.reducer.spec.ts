import {
  testBaseSuggestResultsDto1,
  testQueryResults1,
} from '@newbee/shared/util';
import { RouterActions } from '../router';
import { SearchActions } from './search.actions';
import type { SearchState } from './search.reducer';
import { initialSearchState, searchFeature } from './search.reducer';

describe('SearchReducer', () => {
  const stateAfterSearch: SearchState = {
    ...initialSearchState,
    pendingSearch: true,
  };
  const stateAfterSuggestSuccess: SearchState = {
    ...initialSearchState,
    suggestions: testBaseSuggestResultsDto1.suggestions,
  };

  describe('from initial state', () => {
    it('should update state for search', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.search,
      );
      expect(updatedState).toEqual(stateAfterSearch);
    });
  });

  describe('from altered state', () => {
    it('should update state for searchSuccess', () => {
      let updatedState = searchFeature.reducer(
        stateAfterSearch,
        SearchActions.searchSuccess({ results: testQueryResults1 }),
      );
      expect(updatedState).toEqual({
        ...initialSearchState,
        searchResults: testQueryResults1,
      });

      updatedState = searchFeature.reducer(
        stateAfterSuggestSuccess,
        SearchActions.searchSuccess({ results: testQueryResults1 }),
      );
      expect(updatedState).toEqual({
        ...stateAfterSuggestSuccess,
        searchResults: testQueryResults1,
      });
    });

    it('should update state for suggestSuccess', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.suggestSuccess({ results: testBaseSuggestResultsDto1 }),
      );
      expect(updatedState).toEqual(stateAfterSuggestSuccess);
    });
  });

  it('should udpate state for routerRequest', () => {
    let updatedState = searchFeature.reducer(
      stateAfterSearch,
      RouterActions.routerRequest,
    );
    expect(updatedState).toEqual(initialSearchState);

    updatedState = searchFeature.reducer(
      stateAfterSuggestSuccess,
      RouterActions.routerRequest,
    );
    expect(updatedState).toEqual(initialSearchState);
  });
});
