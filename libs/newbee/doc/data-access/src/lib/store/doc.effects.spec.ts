import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  DocActions,
  initialDocState,
  initialHttpState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl, testHttpClientError1 } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testCreateDocDto1,
  testDoc1,
  testDocAndMemberDto1,
  testDocRelation1,
  testOffsetAndLimit1,
  testOrganization1,
  testOrganizationRelation1,
  testPaginatedResultsDocSearchResult1,
  testUpdateDocDto1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { DocService } from '../doc.service';
import { DocEffects } from './doc.effects';
import { initialDocState as initialDocModuleState } from './doc.reducer';

describe('DocEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: DocEffects;
  let service: DocService;
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            [Keyword.Http]: initialHttpState,
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
            },
            [Keyword.Doc]: {
              ...initialDocState,
              selectedDoc: testDocRelation1,
            },
            [`${Keyword.Doc}Module`]: {
              ...initialDocModuleState,
              docs: testPaginatedResultsDocSearchResult1,
            },
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        DocEffects,
        {
          provide: DocService,
          useValue: createMock<DocService>({
            getAll: jest
              .fn()
              .mockReturnValue(of(testPaginatedResultsDocSearchResult1)),
            create: jest.fn().mockReturnValue(of(testDoc1)),
            get: jest.fn().mockReturnValue(of(testDocAndMemberDto1)),
            markUpToDate: jest.fn().mockReturnValue(of(testDoc1)),
            edit: jest.fn().mockReturnValue(of(testDocAndMemberDto1)),
            delete: jest.fn().mockReturnValue(of(null)),
          }),
        },
      ],
    });

    effects = TestBed.inject(DocEffects);
    service = TestBed.inject(DocService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate');
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('getDocs$', () => {
    it(`should fire getDocsPending if this is the first request, selected organization is set, and there's no error`, () => {
      store.setState({
        [`${Keyword.Doc}Module`]: initialDocModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', { a: DocActions.getDocs() });
      const expected$ = hot('a', { a: DocActions.getDocsPending() });
      expect(effects.getDocs$).toBeObservable(expected$);
    });

    it(`should fire getDocsPending if this is a follow-up request, selected organization is set, there are more results to fetch, and there's no error`, () => {
      store.setState({
        [`${Keyword.Doc}Module`]: {
          ...initialDocModuleState,
          docs: { ...testPaginatedResultsDocSearchResult1, total: 100 },
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', { a: DocActions.getDocs() });
      const expected$ = hot('a', { a: DocActions.getDocsPending() });
      expect(effects.getDocs$).toBeObservable(expected$);
    });

    it('should do nothing if there are no more results to fetch', () => {
      actions$ = hot('a', { a: DocActions.getDocs() });
      const expected$ = hot('-');
      expect(effects.getDocs$).toBeObservable(expected$);
    });

    it(`should do nothing if selected organization isn't set`, () => {
      store.setState({
        [`${Keyword.Doc}Module`]: initialDocModuleState,
        [Keyword.Organization]: initialOrganizationState,
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', { a: DocActions.getDocs() });
      const expected$ = hot('-');
      expect(effects.getDocs$).toBeObservable(expected$);
    });

    it(`should do nothing if there's an error`, () => {
      store.setState({
        [`${Keyword.Doc}Module`]: initialDocModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Http]: { ...initialHttpState, error: testHttpClientError1 },
      });
      actions$ = hot('a', { a: DocActions.getDocs() });
      const expected$ = hot('-');
      expect(effects.getDocs$).toBeObservable(expected$);
    });
  });

  describe('getDocsPending$', () => {
    it('should fire getDocsSuccess if this is the first request', () => {
      store.setState({
        [`${Keyword.Doc}Module`]: initialDocModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: DocActions.getDocsPending(),
      });
      const expected$ = hot('a', {
        a: DocActions.getDocsSuccess({
          docs: testPaginatedResultsDocSearchResult1,
        }),
      });
      expect(effects.getDocsPending$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAll).toHaveBeenCalledTimes(1);
        expect(service.getAll).toHaveBeenCalledWith(
          testOrganization1.slug,
          testOffsetAndLimit1,
        );
      });
    });

    it('should fire getDocsSuccess if this is a follow-up request', () => {
      store.setState({
        [`${Keyword.Doc}Module`]: {
          ...initialDocModuleState,
          docs: {
            ...testPaginatedResultsDocSearchResult1,
            total: 100,
          },
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Http]: initialHttpState,
      });
      actions$ = hot('a', {
        a: DocActions.getDocsPending(),
      });
      const expected$ = hot('a', {
        a: DocActions.getDocsSuccess({
          docs: testPaginatedResultsDocSearchResult1,
        }),
      });
      expect(effects.getDocsPending$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAll).toHaveBeenCalledTimes(1);
        expect(service.getAll).toHaveBeenCalledWith(testOrganization1.slug, {
          ...testOffsetAndLimit1,
          offset: 1,
        });
      });
    });
  });

  describe('createDoc$', () => {
    it('should fire createDocSuccess if successful', () => {
      actions$ = hot('a', {
        a: DocActions.createDoc({ createDocDto: testCreateDocDto1 }),
      });
      const expected$ = hot('a', {
        a: DocActions.createDocSuccess({ doc: testDoc1 }),
      });
      expect(effects.createDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toHaveBeenCalledTimes(1);
        expect(service.create).toHaveBeenCalledWith(
          testOrganization1.slug,
          testCreateDocDto1,
        );
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: DocActions.createDoc({ createDocDto: testCreateDocDto1 }),
      });
      const expected$ = hot('-');
      expect(effects.createDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('createDocSuccess$', () => {
    it('should navigate to doc', () => {
      actions$ = hot('a', {
        a: DocActions.createDocSuccess({ doc: testDoc1 }),
      });
      const expected$ = hot('a', {
        a: [
          DocActions.createDocSuccess({ doc: testDoc1 }),
          testOrganizationRelation1,
        ],
      });
      expect(effects.createDocSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Doc}/${testDoc1.slug}`,
        ]);
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: DocActions.createDocSuccess({ doc: testDoc1 }),
      });
      const expected$ = hot('-');
      expect(effects.createDocSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });

  describe('getDoc$', () => {
    it('should fire getDocSuccess if successful', () => {
      actions$ = hot('a', {
        a: DocActions.getDoc({ slug: testDoc1.slug }),
      });
      const expected$ = hot('a', {
        a: DocActions.getDocSuccess({
          docAndMemberDto: testDocAndMemberDto1,
        }),
      });
      expect(effects.getDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).toHaveBeenCalledTimes(1);
        expect(service.get).toHaveBeenCalledWith(
          testDoc1.slug,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: DocActions.getDoc({ slug: testDoc1.slug }),
      });
      const expected$ = hot('-');
      expect(effects.getDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).not.toHaveBeenCalled();
      });
    });
  });

  describe('markDocAsUpToDate$', () => {
    it('should fire markDocAsUpToDateSuccess if successful', () => {
      actions$ = hot('a', {
        a: DocActions.markDocAsUpToDate(),
      });
      const expected$ = hot('a', {
        a: DocActions.markDocAsUpToDateSuccess({ doc: testDoc1 }),
      });
      expect(effects.markDocAsUpToDate$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.markUpToDate).toHaveBeenCalledTimes(1);
        expect(service.markUpToDate).toHaveBeenCalledWith(
          testDoc1.slug,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization or selectedDoc isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: DocActions.markDocAsUpToDate(),
      });
      const expected$ = hot('-');
      expect(effects.markDocAsUpToDate$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.markUpToDate).not.toHaveBeenCalled();
      });
    });
  });

  describe('editDoc$', () => {
    it('should fire editDocSuccess if successful', () => {
      actions$ = hot('a', {
        a: DocActions.editDoc({ updateDocDto: testUpdateDocDto1 }),
      });
      const expected$ = hot('a', {
        a: DocActions.getDocSuccess({
          docAndMemberDto: testDocAndMemberDto1,
        }),
      });
      expect(effects.editDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toHaveBeenCalledTimes(1);
        expect(service.edit).toHaveBeenCalledWith(
          testDoc1.slug,
          testOrganization1.slug,
          testUpdateDocDto1,
        );
      });
    });

    it(`should do nothing if selectedOrganization or selectedDoc isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: DocActions.editDoc({ updateDocDto: testUpdateDocDto1 }),
      });
      const expected$ = hot('-');
      expect(effects.editDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).not.toHaveBeenCalled();
      });
    });
  });

  describe('deleteDoc$', () => {
    it('should fire deleteDocSuccess if successful', () => {
      actions$ = hot('a', {
        a: DocActions.deleteDoc(),
      });
      const expected$ = hot('a', {
        a: DocActions.deleteDocSuccess(),
      });
      expect(effects.deleteDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).toHaveBeenCalledTimes(1);
        expect(service.delete).toHaveBeenCalledWith(
          testDoc1.slug,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization or selectedDoc isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: DocActions.deleteDoc(),
      });
      const expected$ = hot('-');
      expect(effects.deleteDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe('deleteDocSuccess$', () => {
    it('should navigate to org', () => {
      actions$ = hot('a', {
        a: DocActions.deleteDocSuccess(),
      });
      const expected$ = hot('a', {
        a: [DocActions.deleteDocSuccess(), testOrganizationRelation1],
      });
      expect(effects.deleteDocSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          `/${ShortUrl.Organization}/${testOrganization1.slug}`,
        ]);
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: DocActions.deleteDocSuccess(),
      });
      const expected$ = hot('-');
      expect(effects.deleteDocSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
