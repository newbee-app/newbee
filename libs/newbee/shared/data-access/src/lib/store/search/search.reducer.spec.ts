import {
  testBaseQueryDto1,
  testBaseQueryResultsDto1,
  testBaseSuggestResultsDto1,
  testDocQueryResult1,
  testQnaQueryResult1,
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
  const stateAfterSearchSuccess: SearchState = {
    ...initialSearchState,
    searchResults: testBaseQueryResultsDto1,
  };
  const stateAfterSuggestSuccess: SearchState = {
    ...initialSearchState,
    suggestions: testBaseSuggestResultsDto1.suggestions,
  };
  const stateAfterContinueSearchPending: SearchState = {
    ...stateAfterSearchSuccess,
    pendingContinueSearch: true,
  };

  describe('from initial state', () => {
    it('should update state for search', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.search({ query: testBaseQueryDto1 }),
      );
      expect(updatedState).toEqual(stateAfterSearch);
    });
  });

  describe('from altered state', () => {
    it('should update state for searchSuccess', () => {
      let updatedState = searchFeature.reducer(
        stateAfterSearch,
        SearchActions.searchSuccess({ results: testBaseQueryResultsDto1 }),
      );
      expect(updatedState).toEqual(stateAfterSearchSuccess);

      updatedState = searchFeature.reducer(
        stateAfterSuggestSuccess,
        SearchActions.searchSuccess({ results: testBaseQueryResultsDto1 }),
      );
      expect(updatedState).toEqual({
        ...stateAfterSuggestSuccess,
        searchResults: testBaseQueryResultsDto1,
      });
    });

    it('should update state for suggestSuccess', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.suggestSuccess({ results: testBaseSuggestResultsDto1 }),
      );
      expect(updatedState).toEqual(stateAfterSuggestSuccess);
    });

    it('should update state for continueSearchPending', () => {
      const updatedState = searchFeature.reducer(
        stateAfterSearchSuccess,
        SearchActions.continueSearchPending,
      );
      expect(updatedState).toEqual(stateAfterContinueSearchPending);
    });

    it('should update state for continueSearchSuccess', () => {
      const updatedState = searchFeature.reducer(
        stateAfterContinueSearchPending,
        SearchActions.continueSearchSuccess({
          results: {
            ...testBaseQueryResultsDto1,
            offset: 1,
            results: [testDocQueryResult1, testQnaQueryResult1],
          },
        }),
      );
      expect(updatedState).toEqual({
        ...initialSearchState,
        searchResults: {
          ...testBaseQueryResultsDto1,
          offset: 1,
          results: [
            ...testBaseQueryResultsDto1.results,
            testDocQueryResult1,
            testQnaQueryResult1,
          ],
        },
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
});
