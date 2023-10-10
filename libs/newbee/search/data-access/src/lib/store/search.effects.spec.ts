import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  initialOrganizationState,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import {
  BaseQueryResultDto,
  testBaseQueryDto1,
  testBaseQueryResultDto1,
  testBaseSuggestDto1,
  testBaseSuggestResultDto1,
} from '@newbee/shared/data-access';
import {
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
            org: { selectedOrganization: testOrganizationRelation1 },
          },
        }),
        provideMockActions(() => actions$),
        SearchEffects,
        {
          provide: SearchService,
          useValue: createMock<SearchService>({
            search: jest.fn().mockReturnValue(of(testBaseQueryResultDto1)),
            suggest: jest.fn().mockReturnValue(of(testBaseSuggestResultDto1)),
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
        a: SearchActions.searchSuccess({ result: testBaseQueryResultDto1 }),
      });
      expect(effects.search$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.search).toBeCalledTimes(1);
        expect(service.search).toBeCalledWith(
          testBaseQueryDto1,
          testOrganization1.slug,
        );
      });
    });

    it('should fire searchSuccess and not contact API if query is empty', () => {
      actions$ = hot('a', {
        a: SearchActions.search({ query: { query: '', offset: 0 } }),
      });
      const expected$ = hot('a', {
        a: SearchActions.searchSuccess({ result: new BaseQueryResultDto(0) }),
      });
      expect(effects.search$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.search).not.toBeCalled();
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
        expect(service.search).not.toBeCalled();
      });
    });
  });

  describe('suggest$', () => {
    it('should fire suggestSuccess and contact API if successful', () => {
      actions$ = hot('a', {
        a: SearchActions.suggest({ query: testBaseSuggestDto1 }),
      });
      const expected$ = hot('a', {
        a: SearchActions.suggestSuccess({ result: testBaseSuggestResultDto1 }),
      });
      expect(effects.suggest$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.suggest).toBeCalledTimes(1);
        expect(service.suggest).toBeCalledWith(
          testBaseSuggestDto1,
          testOrganization1.slug,
        );
      });
    });

    it('should fire suggestSuccess and not contact API if query is empty', () => {
      actions$ = hot('a', {
        a: SearchActions.suggest({ query: { query: '' } }),
      });
      const expected$ = hot('a', {
        a: SearchActions.suggestSuccess({ result: { suggestions: [] } }),
      });
      expect(effects.suggest$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.suggest).not.toBeCalled();
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
        expect(service.suggest).not.toBeCalled();
      });
    });
  });
});
