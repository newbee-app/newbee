import { TestBed } from '@angular/core/testing';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrgMember1,
  testOrgMemberRelation1,
  testUser1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import {
  selectCsrfTokenAndScreenError,
  selectOrgMemberUser,
  selectUserAndCsrfToken,
} from './app.selector';
import { initialAuthState } from './auth';
import { initialCookieState } from './cookie';
import { initialHttpState } from './http';
import { initialOrganizationState } from './organization';

describe('AppSelector', () => {
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

  describe('selectOrgMemberUser', () => {
    it('should select org member and user', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          orgMember: testOrgMemberRelation1,
        },
        [Keyword.Auth]: { ...initialAuthState, user: testUser1 },
      });
      const expected$ = hot('a', {
        a: { orgMember: testOrgMember1, user: testUser1 },
      });
      expect(store.select(selectOrgMemberUser)).toBeObservable(expected$);
    });
  });
});
