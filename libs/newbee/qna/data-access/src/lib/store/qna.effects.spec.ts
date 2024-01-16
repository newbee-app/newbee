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
  testBaseUpdateAnswerDto1,
  testBaseUpdateQuestionDto1,
  testOffsetAndLimit1,
  testOrganization1,
  testOrganizationRelation1,
  testPaginatedResultsQnaQueryResult1,
  testQna1,
  testQnaRelation1,
  testTeamRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { QnaService } from '../qna.service';
import { QnaEffects } from './qna.effects';
import { initialQnaState as initialQnaModuleState } from './qna.reducer';

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
            [`${Keyword.Qna}Module`]: {
              ...initialQnaModuleState,
              qnas: testPaginatedResultsQnaQueryResult1,
            },
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        QnaEffects,
        {
          provide: QnaService,
          useValue: createMock<QnaService>({
            getAllPaginated: jest
              .fn()
              .mockReturnValue(of(testPaginatedResultsQnaQueryResult1)),
            create: jest.fn().mockReturnValue(of(testQna1)),
            get: jest.fn().mockReturnValue(of(testBaseQnaAndMemberDto1)),
            markUpToDate: jest.fn().mockReturnValue(of(testQna1)),
            editQuestion: jest
              .fn()
              .mockReturnValue(of(testBaseQnaAndMemberDto1)),
            editAnswer: jest.fn().mockReturnValue(of(testQna1)),
            delete: jest.fn().mockReturnValue(of(null)),
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

  describe('getQnas$', () => {
    it('should fire getQnasSuccess if this is the first request and selected organization is set', () => {
      store.setState({
        [`${Keyword.Qna}Module`]: initialQnaModuleState,
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      actions$ = hot('a', {
        a: QnaActions.getQnas(),
      });
      const expected$ = hot('a', {
        a: QnaActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      });
      expect(effects.getQnas$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllPaginated).toHaveBeenCalledTimes(1);
        expect(service.getAllPaginated).toHaveBeenCalledWith(
          testOrganization1.slug,
          testOffsetAndLimit1,
        );
      });
    });

    it('should fire getQnasSuccess if this is a follow-up request, selected organization is set, and there are more results to fetch', () => {
      store.setState({
        [`${Keyword.Qna}Module`]: {
          ...initialQnaModuleState,
          qnas: {
            ...testPaginatedResultsQnaQueryResult1,
            total: 100,
          },
        },
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
      });
      actions$ = hot('a', {
        a: QnaActions.getQnas(),
      });
      const expected$ = hot('a', {
        a: QnaActions.getQnasSuccess({
          qnas: testPaginatedResultsQnaQueryResult1,
        }),
      });
      expect(effects.getQnas$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllPaginated).toHaveBeenCalledTimes(1);
        expect(service.getAllPaginated).toHaveBeenCalledWith(
          testOrganization1.slug,
          { ...testOffsetAndLimit1, offset: 1 },
        );
      });
    });

    it('should do nothing if there are no more results to fetch', () => {
      actions$ = hot('a', { a: QnaActions.getQnas() });
      const expected$ = hot('-');
      expect(effects.getQnas$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllPaginated).not.toHaveBeenCalled();
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({
        [`${Keyword.Qna}Module`]: initialQnaModuleState,
        [Keyword.Organization]: initialOrganizationState,
      });
      actions$ = hot('a', {
        a: QnaActions.getQnas(),
      });
      const expected$ = hot('-');
      expect(effects.getQnas$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAllPaginated).not.toHaveBeenCalled();
      });
    });
  });

  describe('createQna$', () => {
    it('should fire createQnaSuccess if successful', () => {
      actions$ = hot('a', {
        a: QnaActions.createQna({ createQnaDto: testBaseCreateQnaDto1 }),
      });
      const expected$ = hot('a', {
        a: QnaActions.createQnaSuccess({ qna: testQna1 }),
      });
      expect(effects.createQna$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toHaveBeenCalledTimes(1);
        expect(service.create).toHaveBeenCalledWith(
          testBaseCreateQnaDto1,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization isn't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: QnaActions.createQna({ createQnaDto: testBaseCreateQnaDto1 }),
      });
      const expected$ = hot('-');
      expect(effects.createQna$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).not.toHaveBeenCalled();
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
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
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
        expect(router.navigate).not.toHaveBeenCalled();
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
        expect(service.get).toHaveBeenCalledTimes(1);
        expect(service.get).toHaveBeenCalledWith(
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
        expect(service.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('markQnaAsUpToDate$', () => {
    it('should fire editQnaSuccess if successful', () => {
      actions$ = hot('a', { a: QnaActions.markQnaAsUpToDate() });
      const expected$ = hot('a', {
        a: QnaActions.editQnaSuccess({ qna: testQna1 }),
      });
      expect(effects.markQnaAsUpToDate$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.markUpToDate).toHaveBeenCalledTimes(1);
        expect(service.markUpToDate).toHaveBeenCalledWith(
          testQna1.slug,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization or selectedQna isn't set`, () => {
      store.setState({});
      actions$ = hot('a', { a: QnaActions.markQnaAsUpToDate() });
      const expected$ = hot('-');
      expect(effects.markQnaAsUpToDate$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.markUpToDate).not.toHaveBeenCalled();
      });
    });
  });

  describe('editQuestion$', () => {
    it('should fire getQnaSuccess if successful', () => {
      actions$ = hot('a', {
        a: QnaActions.editQuestion({
          updateQuestionDto: testBaseUpdateQuestionDto1,
        }),
      });
      const expected$ = hot('a', {
        a: QnaActions.getQnaSuccess({
          qnaAndMemberDto: testBaseQnaAndMemberDto1,
        }),
      });
      expect(effects.editQuestion$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.editQuestion).toHaveBeenCalledTimes(1);
        expect(service.editQuestion).toHaveBeenCalledWith(
          testQna1.slug,
          testOrganization1.slug,
          testBaseUpdateQuestionDto1,
        );
      });
    });

    it(`should do nothing if selectedOrganization and selectedQna aren't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: QnaActions.editQuestion({
          updateQuestionDto: testBaseUpdateQuestionDto1,
        }),
      });
      const expected$ = hot('-');
      expect(effects.editQuestion$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.editQuestion).not.toHaveBeenCalled();
      });
    });
  });

  describe('editAnswer$', () => {
    it('should fire editQnaSuccess if successful', () => {
      actions$ = hot('a', {
        a: QnaActions.editAnswer({ updateAnswerDto: testBaseUpdateAnswerDto1 }),
      });
      const expected$ = hot('a', {
        a: QnaActions.editQnaSuccess({ qna: testQna1 }),
      });
      expect(effects.editAnswer$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.editAnswer).toHaveBeenCalledTimes(1);
        expect(service.editAnswer).toHaveBeenCalledWith(
          testQna1.slug,
          testOrganization1.slug,
          testBaseUpdateAnswerDto1,
        );
      });
    });

    it(`should do nothing if selectedOrganization and selectedQna aren't set`, () => {
      store.setState({});
      actions$ = hot('a', {
        a: QnaActions.editAnswer({ updateAnswerDto: testBaseUpdateAnswerDto1 }),
      });
      const expected$ = hot('-');
      expect(effects.editAnswer$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.editAnswer).not.toHaveBeenCalled();
      });
    });
  });

  describe('deleteQna$', () => {
    it('should fire deleteQnaSuccess if successful', () => {
      actions$ = hot('a', { a: QnaActions.deleteQna() });
      const expected$ = hot('a', {
        a: QnaActions.deleteQnaSuccess(),
      });
      expect(effects.deleteQna$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).toHaveBeenCalledTimes(1);
        expect(service.delete).toHaveBeenCalledWith(
          testQna1.slug,
          testOrganization1.slug,
        );
      });
    });

    it(`should do nothing if selectedOrganization and selectedQna aren't set`, () => {
      store.setState({});
      actions$ = hot('a', { a: QnaActions.deleteQna() });
      const expected$ = hot('-');
      expect(effects.deleteQna$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe('deleteQnaSuccess$', () => {
    it('should navigate to org', () => {
      actions$ = hot('a', {
        a: QnaActions.deleteQnaSuccess(),
      });
      const expected$ = hot('a', {
        a: [QnaActions.deleteQnaSuccess(), testOrganizationRelation1],
      });
      expect(effects.deleteQnaSuccess$).toBeObservable(expected$);
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
        a: QnaActions.deleteQnaSuccess(),
      });
      const expected$ = hot('-');
      expect(effects.deleteQnaSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
