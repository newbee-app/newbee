import { TestBed } from '@angular/core/testing';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { initialHttpState } from '../http';
import { initialCookieState } from './cookie.reducer';
import { selectCsrfTokenAndScreenError } from './cookie.selector';

describe('CookieSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: provideMockStore(),
    });

    store = TestBed.inject(MockStore);
  });

  describe('selectCsrfTokenAndScreenError', () => {
    it('should select CSRF token and screen error', () => {
      store.setState({
        [Keyword.Cookie]: { ...initialCookieState, csrfToken: 'token' },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: { csrfToken: 'token', screenError: testHttpScreenError1 },
      });
      expect(store.select(selectCsrfTokenAndScreenError)).toBeObservable(
        expected$,
      );
    });
  });
});
