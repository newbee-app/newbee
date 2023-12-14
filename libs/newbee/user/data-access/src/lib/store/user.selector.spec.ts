import { TestBed } from '@angular/core/testing';
import { initialHttpState } from '@newbee/newbee/shared/data-access';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import { Keyword, testAuthenticator1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { initialUserState } from './user.reducer';
import { selectAuthenticatorsAndScreenError } from './user.selector';

describe('UserSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    store = TestBed.inject(MockStore);
  });

  describe('selectAuthenticatorsAndScreenError', () => {
    it('should select authenticators and screen error', () => {
      store.setState({
        [`${Keyword.User}Module`]: {
          ...initialUserState,
          authenticators: [testAuthenticator1],
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          authenticators: [testAuthenticator1],
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectAuthenticatorsAndScreenError)).toBeObservable(
        expected$,
      );
    });
  });
});
