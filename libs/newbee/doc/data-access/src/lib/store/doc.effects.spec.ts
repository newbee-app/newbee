import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  DocActions,
  initialDocState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testBaseCreateDocDto1,
  testBaseDocAndMemberDto1,
  testBaseUpdateDocDto1,
  testDoc1,
  testDocRelation1,
  testOrganization1,
  testOrganizationRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { DocService } from '../doc.service';
import { DocEffects } from './doc.effects';

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
            [Keyword.Organization]: {
              ...initialOrganizationState,
              selectedOrganization: testOrganizationRelation1,
            },
            [Keyword.Doc]: {
              ...initialDocState,
              selectedDoc: testDocRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        DocEffects,
        {
          provide: DocService,
          useValue: createMock<DocService>({
            create: jest.fn().mockReturnValue(of(testDoc1)),
            get: jest.fn().mockReturnValue(of(testBaseDocAndMemberDto1)),
            markUpToDate: jest.fn().mockReturnValue(of(testDoc1)),
            edit: jest.fn().mockReturnValue(of(testDoc1)),
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

  describe('createDoc$', () => {
    it('should fire createDocSuccess if successful', () => {
      actions$ = hot('a', {
        a: DocActions.createDoc({ createDocDto: testBaseCreateDocDto1 }),
      });
      const expected$ = hot('a', {
        a: DocActions.createDocSuccess({ doc: testDoc1 }),
      });
      expect(effects.createDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toBeCalledTimes(1);
        expect(service.create).toBeCalledWith(
          testOrganization1.slug,
          testBaseCreateDocDto1,
        );
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: DocActions.createDoc({ createDocDto: testBaseCreateDocDto1 }),
      });
      const expected$ = hot('-');
      expect(effects.createDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).not.toBeCalled();
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
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith([
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
        expect(router.navigate).not.toBeCalled();
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
          docAndMemberDto: testBaseDocAndMemberDto1,
        }),
      });
      expect(effects.getDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).toBeCalledTimes(1);
        expect(service.get).toBeCalledWith(
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
        expect(service.get).not.toBeCalled();
      });
    });
  });

  describe('markDocAsUpToDate$', () => {
    it('should fire editDocSuccess if successful', () => {
      actions$ = hot('a', {
        a: DocActions.markDocAsUpToDate(),
      });
      const expected$ = hot('a', {
        a: DocActions.editDocSuccess({ doc: testDoc1 }),
      });
      expect(effects.markDocAsUpToDate$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.markUpToDate).toBeCalledTimes(1);
        expect(service.markUpToDate).toBeCalledWith(
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
        expect(service.markUpToDate).not.toBeCalled();
      });
    });
  });

  describe('editDoc$', () => {
    it('should fire editDocSuccess if successful', () => {
      actions$ = hot('a', {
        a: DocActions.editDoc({ updateDocDto: testBaseUpdateDocDto1 }),
      });
      const expected$ = hot('a', {
        a: DocActions.editDocSuccess({ doc: testDoc1 }),
      });
      expect(effects.editDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).toBeCalledTimes(1);
        expect(service.edit).toBeCalledWith(
          testDoc1.slug,
          testOrganization1.slug,
          testBaseUpdateDocDto1,
        );
      });
    });

    it(`should do nothing if selectedOrganization or selectedDoc isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: DocActions.editDoc({ updateDocDto: testBaseUpdateDocDto1 }),
      });
      const expected$ = hot('-');
      expect(effects.editDoc$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.edit).not.toBeCalled();
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
        expect(service.delete).toBeCalledTimes(1);
        expect(service.delete).toBeCalledWith(
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
        expect(service.delete).not.toBeCalled();
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
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith([
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
        expect(router.navigate).not.toBeCalled();
      });
    });
  });
});
