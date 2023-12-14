import { TestBed } from '@angular/core/testing';
import {
  initialDocState,
  initialHttpState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testDocRelation1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import {
  selectDocAndOrg,
  selectDocAndOrgStates,
  selectDocAndScreenError,
} from './doc.selector';

describe('DocSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: initialOrganizationState,
            [Keyword.Doc]: initialDocState,
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
