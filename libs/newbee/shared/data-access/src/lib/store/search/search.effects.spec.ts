import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  testBaseQueryDto1,
  testBaseQueryResultDto1,
  testBaseSuggestDto1,
  testBaseSuggestResultDto1,
} from '@newbee/shared/data-access';
import { testOrganization1, testOrgMemberRelation1 } from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { SearchService } from '../../service';
import { initialOrganizationState } from '../organization';
import { SearchActions } from './search.actions';
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
            org: { selectedOrganization: testOrgMemberRelation1 },
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
    it('should fire searchSuccess if successful', () => {
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
          testOrganization1.slug
        );
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
    it('should fire suggestSuccess if successful', () => {
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
          testOrganization1.slug
        );
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
