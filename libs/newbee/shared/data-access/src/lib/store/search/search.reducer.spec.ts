import {
  testBaseQueryResultDto1,
  testBaseSuggestResultDto1,
} from '@newbee/shared/data-access';
import { testQueryResult1 } from '@newbee/shared/util';
import { RouterActions } from '../router';
import { SearchActions } from './search.actions';
import type { SearchState } from './search.reducer';
import { initialSearchState, searchFeature } from './search.reducer';

describe('SearchReducer', () => {
  const stateAfterSearch: SearchState = {
    ...initialSearchState,
    pendingSearch: true,
  };
  const stateAfterSuggest: SearchState = {
    ...initialSearchState,
    pendingSuggest: true,
  };
  const stateAfterSuggestSuccess: SearchState = {
    ...initialSearchState,
    suggestions: testBaseSuggestResultDto1.suggestions,
  };

  describe('from initial state', () => {
    it('should update state for search', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.search
      );
      expect(updatedState).toEqual(stateAfterSearch);
    });

    it('should update state for suggest', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.suggest
      );
      expect(updatedState).toEqual(stateAfterSuggest);
    });
  });

  describe('from altered state', () => {
    it('should update state for searchSuccess', () => {
      let updatedState = searchFeature.reducer(
        stateAfterSearch,
        SearchActions.searchSuccess({ result: testBaseQueryResultDto1 })
      );
      expect(updatedState).toEqual({
        ...initialSearchState,
        searchResult: testQueryResult1,
      });

      updatedState = searchFeature.reducer(
        stateAfterSuggestSuccess,
        SearchActions.searchSuccess({ result: testBaseQueryResultDto1 })
      );
      expect(updatedState).toEqual({
        ...stateAfterSuggestSuccess,
        searchResult: testQueryResult1,
      });
    });

    it('should update state for suggestSuccess', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.suggestSuccess({ result: testBaseSuggestResultDto1 })
      );
      expect(updatedState).toEqual(stateAfterSuggestSuccess);
    });
  });

  it('should udpate state for routerRequest', () => {
    let updatedState = searchFeature.reducer(
      stateAfterSearch,
      RouterActions.routerRequest
    );
    expect(updatedState).toEqual(initialSearchState);

    updatedState = searchFeature.reducer(
      stateAfterSuggest,
      RouterActions.routerRequest
    );
    expect(updatedState).toEqual(initialSearchState);

    updatedState = searchFeature.reducer(
      stateAfterSuggestSuccess,
      RouterActions.routerRequest
    );
    expect(updatedState).toEqual(initialSearchState);
  });
});
