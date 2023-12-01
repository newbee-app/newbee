import { TestBed } from '@angular/core/testing';
import {
  initialHttpState,
  initialSearchState,
} from '@newbee/newbee/shared/data-access';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import { Keyword, testDocQueryResult1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { selectSearchResultAndScreenError } from './search.selector';

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

  describe('selectSearchResultAndScreenError', () => {
    it('should select search result and screen error', () => {
      store.setState({
        [Keyword.Search]: {
          ...initialSearchState,
          searchResult: testDocQueryResult1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          searchResult: testDocQueryResult1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectSearchResultAndScreenError)).toBeObservable(
        expected$,
      );
    });
  });
});
