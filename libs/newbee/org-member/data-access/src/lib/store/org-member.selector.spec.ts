import { TestBed } from '@angular/core/testing';
import {
  initialHttpState,
  initialOrgMemberState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrgMemberRelation1,
  testOrganizationRelation1,
  testPaginatedResultsDocQueryResult1,
  testPaginatedResultsQnaQueryResult1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { initialOrgMemberState as initialOrgMemberModuleState } from './org-member.reducer';
import {
  selectOrgMemberAndOrg,
  selectOrgMemberAndScreenError,
  selectOrgMemberPostsAndOrg,
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

  describe('selectOrgMemberPostsAndOrg', () => {
    it(`should select the org member's posts, selected org member, and selected org`, () => {
      store.setState({
        [`${Keyword.Member}Module`]: {
          ...initialOrgMemberModuleState,
          docs: testPaginatedResultsDocQueryResult1,
          qnas: testPaginatedResultsQnaQueryResult1,
        },
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
          docs: testPaginatedResultsDocQueryResult1,
          qnas: testPaginatedResultsQnaQueryResult1,
          selectedOrgMember: testOrgMemberRelation1,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      expect(store.select(selectOrgMemberPostsAndOrg)).toBeObservable(
        expected$,
      );
    });
  });
});
