import { TestBed } from '@angular/core/testing';
import { Keyword, testUser1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { initialCookieState } from '../cookie';
import { initialAuthState } from './auth.reducer';
import { selectUserAndCsrfToken } from './auth.selector';

describe('AuthSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    store = TestBed.inject(MockStore);
  });

  describe('selectUserAndCsrfToken', () => {
    it('should select user and csrf token', () => {
      store.setState({
        [Keyword.Auth]: {
          ...initialAuthState,
          user: testUser1,
        },
        [Keyword.Cookie]: {
          ...initialCookieState,
          csrfToken: 'token',
        },
      });
      const expected$ = hot('a', {
        a: { user: testUser1, csrfToken: 'token' },
      });
      expect(store.select(selectUserAndCsrfToken)).toBeObservable(expected$);
    });
  });
});
