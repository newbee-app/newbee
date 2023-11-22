import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  DocActions,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testBaseCreateDocDto1,
  testDoc1,
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
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        DocEffects,
        {
          provide: DocService,
          useValue: createMock<DocService>({
            create: jest.fn().mockReturnValue(of(testDoc1)),
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
});
