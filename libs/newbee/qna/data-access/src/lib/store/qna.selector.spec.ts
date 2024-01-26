import { TestBed } from '@angular/core/testing';
import {
  initialHttpState,
  initialOrganizationState,
  initialQnaState,
} from '@newbee/newbee/shared/data-access';
import {
  testHttpClientError1,
  testHttpScreenError1,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  testOrganizationRelation1,
  testPaginatedResultsQnaQueryResult1,
  testQnaRelation1,
} from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { initialQnaState as initialQnaModuleState } from './qna.reducer';
import {
  selectQnaAndOrg,
  selectQnaAndOrgStates,
  selectQnaAndScreenError,
  selectQnasOrgAndError,
} from './qna.selector';

describe('QnaSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Http]: initialHttpState,
            [Keyword.Organization]: initialOrganizationState,
            [Keyword.Qna]: initialQnaState,
            [`${Keyword.Qna}Module`]: initialQnaModuleState,
          },
        }),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  describe('selectQnaAndOrg', () => {
    it('should handle null values', () => {
      const expected$ = hot('a', {
        a: { selectedQna: null, selectedOrganization: null },
      });
      expect(store.select(selectQnaAndOrg)).toBeObservable(expected$);
    });

    it('should return currently selected qna and org', () => {
      store.setState({
        [Keyword.Qna]: {
          ...initialQnaState,
          selectedQna: testQnaRelation1,
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedQna: testQnaRelation1,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      expect(store.select(selectQnaAndOrg)).toBeObservable(expected$);
    });
  });

  describe('selectQnasOrgAndError', () => {
    it('should handle null values', () => {
      const expected$ = hot('a', {
        a: { qnas: null, selectedOrganization: null, error: null },
      });
      expect(store.select(selectQnasOrgAndError)).toBeObservable(expected$);
    });

    it('should return qnas, org, and error', () => {
      store.setState({
        [`${Keyword.Qna}Module`]: {
          ...initialQnaModuleState,
          qnas: testPaginatedResultsQnaQueryResult1,
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
          qnas: testPaginatedResultsQnaQueryResult1,
          selectedOrganization: testOrganizationRelation1,
          error: testHttpClientError1,
        },
      });
      expect(store.select(selectQnasOrgAndError)).toBeObservable(expected$);
    });
  });

  describe('selectQnaAndScreenError', () => {
    it('should select qna and screen error', () => {
      store.setState({
        [Keyword.Qna]: {
          ...initialQnaState,
          selectedQna: testQnaRelation1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedQna: testQnaRelation1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectQnaAndScreenError)).toBeObservable(expected$);
    });
  });

  describe('selectQnaAndOrgStates', () => {
    it('should select qna and org states', () => {
      const expected$ = hot('a', {
        a: { qnaState: initialQnaState, orgState: initialOrganizationState },
      });
      expect(store.select(selectQnaAndOrgStates)).toBeObservable(expected$);
    });
  });
});
