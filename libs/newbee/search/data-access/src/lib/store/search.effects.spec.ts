import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  initialHttpState,
  initialOrganizationState,
  initialSearchState,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import { testHttpClientError1 } from '@newbee/newbee/shared/util';
import {
  BaseQueryResultsDto,
  Keyword,
  testBaseQueryDto1,
  testBaseQueryResultsDto1,
  testBaseSuggestDto1,
  testBaseSuggestResultsDto1,
  testOrganization1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { SearchService } from '../search.service';
import { SearchEffects } from './search.effects';

describe('SearchEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: SearchEffects;
  let service: SearchService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
            },
            [Keyword.Search]: {
              ...initialSearchState,
              searchResults: testBaseQueryResultsDto1,
            },
            [Keyword.Http]: initialHttpState,
          },
        }),
        provideMockActions(() => actions$),
        SearchEffects,
        {
          provide: SearchService,
          useValue: createMock<SearchService>({
            search: jest.fn().mockReturnValue(of(testBaseQueryResultsDto1)),
            suggest: jest.fn().mockReturnValue(of(testBaseSuggestResultsDto1)),
          }),
        },
      ],
    });

    effects = TestBed.inject(SearchEffects);
    service = TestBed.inject(SearchService);
    store = TestBed.inject(MockStore);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
    expect(store).toBeDefined();
  });

  describe('search$', () => {
    it('should fire searchSuccess and contact API if successful', () => {
      actions$ = hot('a', {
        a: SearchActions.search({ query: testBaseQueryDto1 }),
      });
      const expected$ = hot('a', {
        a: SearchActions.searchSuccess({ results: testBaseQueryResultsDto1 }),
      });
      expect(effects.search$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.search).toHaveBeenCalledTimes(1);
        expect(service.search).toHaveBeenCalledWith(
          testBaseQueryDto1,
          testOrganization1.slug,
        );
      });
    });

    it('should do nothing if query is empty', () => {
      actions$ = hot('a', {
        a: SearchActions.search({
          query: new BaseQueryResultsDto(),
        }),
      });
      const expected$ = hot('-');
      expect(effects.search$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.search).not.toHaveBeenCalled();
      });
    });

    it('should not fire if selectedOrganization is null', () => {
      store.setState({ org: initialOrganizationState });
      actions$ = hot('a', {
        a: SearchActions.search({ query: testBaseQueryDto1 }),
      });
      const expected$ = hot('-');
      expect(effects.search$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.search).not.toHaveBeenCalled();
      });
    });
  });

  describe('continueSearch$', () => {
    it(`should fire continueSearchPending if selected organization is set, search results are set, there are more results to fetch, and there's no error`, () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Search]: {
          ...initialSearchState,
          searchResults: { ...testBaseQueryResultsDto1, total: 100 },
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: SearchActions.continueSearch(),
      });
      const expected$ = hot('a', {
        a: SearchActions.continueSearchPending(),
      });
      expect(effects.continueSearch$).toBeObservable(expected$);
    });

    it('should do nothing if there are no more results to fetch', () => {
      actions$ = hot('a', { a: SearchActions.continueSearch() });
      const expected$ = hot('-');
      expect(effects.continueSearch$).toBeObservable(expected$);
    });

    it('should do nothing if searchResults is null', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Search]: initialSearchState,
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', { a: SearchActions.continueSearch() });
      const expected$ = hot('-');
      expect(effects.continueSearch$).toBeObservable(expected$);
    });

    it('should do nothing if selectedOrganization is null', () => {
      store.setState({
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Search]: {
          ...initialSearchState,
          searchResults: { ...testBaseQueryResultsDto1, total: 100 },
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', { a: SearchActions.continueSearch() });
      const expected$ = hot('-');
      expect(effects.continueSearch$).toBeObservable(expected$);
    });

    it(`should do nothing if there's an error`, () => {
      store.setState({
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Search]: {
          ...initialSearchState,
          searchResults: { ...testBaseQueryResultsDto1, total: 100 },
        },
        [Keyword.Http]: { ...initialHttpState, error: testHttpClientError1 },
      });
      actions$ = hot('a', { a: SearchActions.continueSearch() });
      const expected$ = hot('-');
      expect(effects.continueSearch$).toBeObservable(expected$);
    });
  });

  describe('continueSearchPending$', () => {
    it('should fire conitnueSearchSuccess', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Search]: {
          ...initialSearchState,
          searchResults: testBaseQueryResultsDto1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: SearchActions.continueSearchPending(),
      });
      const expected$ = hot('a', {
        a: SearchActions.continueSearchSuccess({
          results: testBaseQueryResultsDto1,
        }),
      });
      expect(effects.continueSearchPending$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.search).toHaveBeenCalledTimes(1);
        expect(service.search).toHaveBeenCalledWith(
          {
            ...testBaseQueryResultsDto1,
            offset: 1,
          },
          testOrganization1.slug,
        );
      });
    });
  });

  describe('suggest$', () => {
    it('should fire suggestSuccess if suggest', () => {
      actions$ = hot('a', {
        a: SearchActions.suggest({ query: testBaseSuggestDto1 }),
      });
      const expected$ = hot('a', {
        a: SearchActions.suggestSuccess({
          results: testBaseSuggestResultsDto1,
        }),
      });
      expect(effects.suggest$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.suggest).toHaveBeenCalledTimes(1);
        expect(service.suggest).toHaveBeenCalledWith(
          testBaseSuggestDto1,
          testOrganization1.slug,
        );
      });
    });

    it('should fire suggestSuccess if search', () => {
      actions$ = hot('a', {
        a: SearchActions.search({ query: testBaseQueryDto1 }),
      });
      const expected$ = hot('a', {
        a: SearchActions.suggestSuccess({
          results: testBaseSuggestResultsDto1,
        }),
      });
      expect(effects.suggest$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.suggest).toHaveBeenCalledTimes(1);
        expect(service.suggest).toHaveBeenCalledWith(
          testBaseQueryDto1,
          testOrganization1.slug,
        );
      });
    });

    it('should do nothing if query is empty', () => {
      actions$ = hot('a', {
        a: SearchActions.suggest({ query: { query: '' } }),
      });
      const expected$ = hot('-');
      expect(effects.suggest$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.suggest).not.toHaveBeenCalled();
      });
    });

    it('should not fire if selectedOrganization is null', () => {
      store.setState({ org: initialOrganizationState });
      actions$ = hot('a', {
        a: SearchActions.suggest({ query: testBaseSuggestDto1 }),
      });
      const expected$ = hot('-');
      expect(effects.suggest$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.suggest).not.toHaveBeenCalled();
      });
    });
  });
});
