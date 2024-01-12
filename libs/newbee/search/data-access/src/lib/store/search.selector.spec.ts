import { TestBed } from '@angular/core/testing';
import {
  initialHttpState,
  initialSearchState,
} from '@newbee/newbee/shared/data-access';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import { Keyword, testQueryResults1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { selectSearchResultsAndScreenError } from './search.selector';

describe('SearchSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    store = TestBed.inject(MockStore);
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  describe('selectSearchResultsAndScreenError', () => {
    it('should select search results and screen error', () => {
      store.setState({
        [Keyword.Search]: {
          ...initialSearchState,
          searchResults: testQueryResults1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          searchResults: testQueryResults1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectSearchResultsAndScreenError)).toBeObservable(
        expected$,
      );
    });
  });
});
