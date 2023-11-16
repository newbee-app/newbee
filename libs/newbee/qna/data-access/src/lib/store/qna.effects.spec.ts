import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  QnaActions,
  initialOrganizationState,
  initialQnaState,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  testBaseCreateQnaDto1,
  testBaseQnaAndMemberDto1,
  testOrganization1,
  testOrganizationRelation1,
  testQna1,
  testQnaRelation1,
  testTeam1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { QnaService } from '../qna.service';
import { QnaEffects } from './qna.effects';

describe('QnaEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: QnaEffects;
  let service: QnaService;
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
            [Keyword.Team]: {
              ...initialQnaState,
              selectedTeam: testTeamRelation1,
            },
            [Keyword.Qna]: {
              ...initialQnaState,
              selectedQna: testQnaRelation1,
            },
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        QnaEffects,
        {
          provide: QnaService,
          useValue: createMock<QnaService>({
            create: jest.fn().mockReturnValue(of(testQna1)),
            get: jest.fn().mockReturnValue(of(testBaseQnaAndMemberDto1)),
            markUpToDate: jest.fn().mockReturnValue(of(testQna1)),
          }),
        },
      ],
    });

    effects = TestBed.inject(QnaEffects);
    service = TestBed.inject(QnaService);
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

  describe('createQna$', () => {
    it('should fire createQnaSuccess if successful', () => {
      actions$ = hot('a', {
        a: QnaActions.createQna({
          createQnaDto: testBaseCreateQnaDto1,
          team: testTeam1,
        }),
      });
      const expected$ = hot('a', {
        a: QnaActions.createQnaSuccess({ qna: testQna1 }),
      });
      expect(effects.createQna$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toBeCalledTimes(1);
        expect(service.create).toBeCalledWith(
          testBaseCreateQnaDto1,
          testOrganization1.slug,
          testTeam1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: QnaActions.createQna({
          createQnaDto: testBaseCreateQnaDto1,
          team: testTeam1,
        }),
      });
      const expected$ = hot('-');
      expect(effects.createQna$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).not.toBeCalled();
      });
    });
  });

  describe('createQnaSuccess$', () => {
    it('should navigate to qna', () => {
      actions$ = hot('a', {
        a: QnaActions.createQnaSuccess({ qna: testQna1 }),
      });
      const expected$ = hot('a', {
        a: [
          QnaActions.createQnaSuccess({ qna: testQna1 }),
          testOrganizationRelation1,
        ],
      });
      expect(effects.createQnaSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith([
          `/${ShortUrl.Organization}/${testOrganization1.slug}/${ShortUrl.Qna}/${testQna1.slug}`,
        ]);
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: QnaActions.createQnaSuccess({ qna: testQna1 }),
      });
      const expected$ = hot('-');
      expect(effects.createQnaSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).not.toBeCalled();
      });
    });
  });

  describe('getQna$', () => {
    it('should fire getQnaSuccess if successful', () => {
      actions$ = hot('a', {
        a: QnaActions.getQna({ slug: testQna1.slug }),
      });
      const expected$ = hot('a', {
        a: QnaActions.getQnaSuccess({
          qnaAndMemberDto: testBaseQnaAndMemberDto1,
        }),
      });
      expect(effects.getQna$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.get).toBeCalledTimes(1);
        expect(service.get).toBeCalledWith(
          testQna1.slug,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', { a: QnaActions.getQna({ slug: testQna1.slug }) });
      const expected$ = hot('-');
      expect(effects.getQna$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).not.toBeCalled();
      });
    });
  });

  describe('markQnaAsUpToDate$', () => {
    it('should fire markQnaAsUpToDateSuccess if successful', () => {
      actions$ = hot('a', { a: QnaActions.markQnaAsUpToDate() });
      const expected$ = hot('a', {
        a: QnaActions.markQnaAsUpToDateSuccess({
          oldSlug: testQna1.slug,
          newQna: testQna1,
        }),
      });
      expect(effects.markQnaAsUpToDate$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.markUpToDate).toBeCalledTimes(1);
        expect(service.markUpToDate).toBeCalledWith(
          testQna1.slug,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization and selectedQna aren't set`, () => {
      store.setState({});
      actions$ = hot('a', { a: QnaActions.markQnaAsUpToDate() });
      const expected$ = hot('-');
      expect(effects.markQnaAsUpToDate$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.markUpToDate).not.toBeCalled();
      });
    });
  });
});
