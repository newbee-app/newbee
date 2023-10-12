import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { QnaActions } from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { testBaseCreateQnaDto1 } from '@newbee/shared/data-access';
import {
  Keyword,
  testOrganization1,
  testOrganizationRelation1,
  testQna1,
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
              selectedOrganization: testOrganizationRelation1,
            },
            [Keyword.Team]: { selectedTeam: testTeamRelation1 },
          },
        }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        QnaEffects,
        {
          provide: QnaService,
          useValue: createMock<QnaService>({
            create: jest.fn().mockReturnValue(of(testQna1)),
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
});
