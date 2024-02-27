import { TestBed } from '@angular/core/testing';
import {
  initialDocState,
  initialHttpState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import {
  testHttpClientError1,
  testHttpScreenError1,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  testDocRelation1,
  testOrganizationRelation1,
  testPaginatedResultsDocSearchResult1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { initialDocState as initialDocModuleState } from './doc.reducer';
import {
  selectDocAndOrg,
  selectDocAndOrgStates,
  selectDocAndScreenError,
  selectDocsOrgAndError,
} from './doc.selector';

describe('DocSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Http]: initialHttpState,
            [Keyword.Organization]: initialOrganizationState,
            [Keyword.Doc]: initialDocState,
            [`${Keyword.Doc}Module`]: initialDocModuleState,
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  describe('selectDocAndOrg', () => {
    it('should handle null values', () => {
      const expected$ = hot('a', {
        a: { selectedDoc: null, selectedOrganization: null },
      });
      expect(store.select(selectDocAndOrg)).toBeObservable(expected$);
    });

    it('should return currently selected doc and org', () => {
      store.setState({
        [Keyword.Doc]: {
          ...initialDocState,
          selectedDoc: testDocRelation1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedDoc: testDocRelation1,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      expect(store.select(selectDocAndOrg)).toBeObservable(expected$);
    });
  });

  describe('selectDocsOrgAndError', () => {
    it('should handle null values', () => {
      const expected$ = hot('a', {
        a: { docs: null, selectedOrganization: null, error: null },
      });
      expect(store.select(selectDocsOrgAndError)).toBeObservable(expected$);
    });

    it('should return docs and org', () => {
      store.setState({
        [`${Keyword.Doc}Module`]: {
          ...initialDocModuleState,
          docs: testPaginatedResultsDocSearchResult1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          error: testHttpClientError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          docs: testPaginatedResultsDocSearchResult1,
          selectedOrganization: testOrganizationRelation1,
          error: testHttpClientError1,
        },
      });
      expect(store.select(selectDocsOrgAndError)).toBeObservable(expected$);
    });
  });

  describe('selectDocAndScreenError', () => {
    it('should return doc and screen error', () => {
      store.setState({
        [Keyword.Doc]: {
          ...initialDocState,
          selectedDoc: testDocRelation1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedDoc: testDocRelation1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectDocAndScreenError)).toBeObservable(expected$);
    });
  });

  describe('selectDocAndOrgStates', () => {
    it('should return doc and org states', () => {
      const expected$ = hot('a', {
        a: { orgState: initialOrganizationState, docState: initialDocState },
      });
      expect(store.select(selectDocAndOrgStates)).toBeObservable(expected$);
    });
  });
});
