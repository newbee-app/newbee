import {
  testBaseQueryResultDto1,
  testBaseSuggestResultDto1,
} from '@newbee/shared/data-access';
import { testQueryResult1 } from '@newbee/shared/util';
import { SearchActions } from './search.actions';
import type { SearchState } from './search.reducer';
import { initialSearchState, searchFeature } from './search.reducer';

describe('SearchReducer', () => {
  const stateAfterSuggestSuccess: SearchState = {
    ...initialSearchState,
    suggestions: testBaseSuggestResultDto1.suggestions,
  };

  describe('from initial state', () => {
    it('should update state for suggestSuccess', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.suggestSuccess({ result: testBaseSuggestResultDto1 })
      );
      expect(updatedState).toEqual(stateAfterSuggestSuccess);
    });
  });

  describe('from suggest success', () => {
    it('should update state for searchSuccess', () => {
      const updatedState = searchFeature.reducer(
        stateAfterSuggestSuccess,
        SearchActions.searchSuccess({ result: testBaseQueryResultDto1 })
      );
      expect(updatedState).toEqual({
        searchResult: testQueryResult1,
        suggestions: [],
      });
    });
  });
});
