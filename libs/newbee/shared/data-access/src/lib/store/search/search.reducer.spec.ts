import {
  testDocQueryResult1,
  testQnaQueryResult1,
  testQueryDto1,
  testQueryResultsDto1,
  testSuggestResultsDto1,
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
    searchResults: testQueryResultsDto1,
  };
  const stateAfterSuggestSuccess: SearchState = {
    ...initialSearchState,
    suggestions: testSuggestResultsDto1.suggestions,
  };
  const stateAfterContinueSearchPending: SearchState = {
    ...stateAfterSearchSuccess,
    pendingContinueSearch: true,
  };

  describe('from initial state', () => {
    it('should update state for search', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.search({ query: testQueryDto1 }),
      );
      expect(updatedState).toEqual(stateAfterSearch);
    });
  });

  describe('from altered state', () => {
    it('should update state for searchSuccess', () => {
      let updatedState = searchFeature.reducer(
        stateAfterSearch,
        SearchActions.searchSuccess({ results: testQueryResultsDto1 }),
      );
      expect(updatedState).toEqual(stateAfterSearchSuccess);

      updatedState = searchFeature.reducer(
        stateAfterSuggestSuccess,
        SearchActions.searchSuccess({ results: testQueryResultsDto1 }),
      );
      expect(updatedState).toEqual({
        ...stateAfterSuggestSuccess,
        searchResults: testQueryResultsDto1,
      });
    });

    it('should update state for suggestSuccess', () => {
      const updatedState = searchFeature.reducer(
        initialSearchState,
        SearchActions.suggestSuccess({ results: testSuggestResultsDto1 }),
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
            ...testQueryResultsDto1,
            offset: 1,
            results: [testDocQueryResult1, testQnaQueryResult1],
          },
        }),
      );
      expect(updatedState).toEqual({
        ...initialSearchState,
        searchResults: {
          ...testQueryResultsDto1,
          offset: 1,
          results: [
            ...testQueryResultsDto1.results,
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
