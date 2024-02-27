import { TestBed } from '@angular/core/testing';
import {
  initialHttpState,
  initialOrgMemberState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import {
  testHttpClientError1,
  testHttpScreenError1,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrgMemberRelation1,
  testOrganizationRelation1,
  testPaginatedResultsDocSearchResult1,
  testPaginatedResultsQnaSearchResult1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { initialOrgMemberState as initialOrgMemberModuleState } from './org-member.reducer';
import {
  selectOrgMemberAndOrg,
  selectOrgMemberAndScreenError,
  selectOrgMemberPostsOrgAndError,
} from './org-member.selector';

describe('OrgMemberSelector', () => {
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

  describe('selectOrgMemberAndOrg', () => {
    it('should select org member and org', () => {
      store.setState({
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedOrgMember: testOrgMemberRelation1,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      expect(store.select(selectOrgMemberAndOrg)).toBeObservable(expected$);
    });
  });

  describe('selectOrgMemberAndScreenError', () => {
    it('should select org member and screen error', () => {
      store.setState({
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedOrgMember: testOrgMemberRelation1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectOrgMemberAndScreenError)).toBeObservable(
        expected$,
      );
    });
  });

  describe('selectOrgMemberPostsOrgAndError', () => {
    it(`should select the org member's posts, selected org member, selected org, and error`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: {
          ...initialOrgMemberModuleState,
          docs: testPaginatedResultsDocSearchResult1,
          qnas: testPaginatedResultsQnaSearchResult1,
        },
        [Keyword.Member]: {
          ...initialOrgMemberState,
          selectedOrgMember: testOrgMemberRelation1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Http]: { ...initialHttpState, error: testHttpClientError1 },
      });
      const expected$ = hot('a', {
        a: {
          docs: testPaginatedResultsDocSearchResult1,
          qnas: testPaginatedResultsQnaSearchResult1,
          selectedOrgMember: testOrgMemberRelation1,
          selectedOrganization: testOrganizationRelation1,
          error: testHttpClientError1,
        },
      });
      expect(store.select(selectOrgMemberPostsOrgAndError)).toBeObservable(
        expected$,
      );
    });
  });
});
