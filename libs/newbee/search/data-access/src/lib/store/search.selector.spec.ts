import { TestBed } from '@angular/core/testing';
import {
  initialHttpState,
  initialOrganizationState,
  initialSearchState,
} from '@newbee/newbee/shared/data-access';
import {
  testHttpClientError1,
  testHttpScreenError1,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrgSearchResultsDto1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import {
  selectSearchResultsAndScreenError,
  selectSearchResultsOrgAndError,
} from './search.selector';

describe('SearchSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Search]: {
              ...initialSearchState,
              searchResults: testOrgSearchResultsDto1,
            },
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
            },
            [Keyword.Http]: {
              ...initialHttpState,
              error: testHttpClientError1,
              screenError: testHttpScreenError1,
            },
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  describe('selectSearchResultsAndScreenError', () => {
    it('should select search results and screen error', () => {
      const expected$ = hot('a', {
        a: {
          searchResults: testOrgSearchResultsDto1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectSearchResultsAndScreenError)).toBeObservable(
        expected$,
      );
    });
  });

  describe('selectSeachResultsOrgAndError', () => {
    it('should select seach results, currently selected org, and error', () => {
      const expected$ = hot('a', {
        a: {
          searchResults: testOrgSearchResultsDto1,
          selectedOrganization: testOrganizationRelation1,
          error: testHttpClientError1,
        },
      });
      expect(store.select(selectSearchResultsOrgAndError)).toBeObservable(
        expected$,
      );
    });
  });
});
