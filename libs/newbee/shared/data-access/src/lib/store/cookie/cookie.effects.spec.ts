import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { testBaseCsrfTokenAndDataDto1 } from '@newbee/shared/data-access';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { CookieService } from '../../service';
import { CookieActions } from './cookie.actions';
import { CookieEffects } from './cookie.effects';
import { initialCookieState } from './cookie.reducer';

describe('CookieEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: CookieEffects;
  let service: CookieService;
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { cookie: initialCookieState } }),
        provideMockActions(() => actions$),
        CookieEffects,
        {
          provide: CookieService,
          useValue: createMock<CookieService>({
            initCookies: jest
              .fn()
              .mockReturnValue(of(testBaseCsrfTokenAndDataDto1)),
          }),
        },
        {
          provide: Router,
          useValue: createMock<Router>({
            navigate: jest.fn().mockResolvedValue(true),
          }),
        },
      ],
    });

    effects = TestBed.inject(CookieEffects);
    service = TestBed.inject(CookieService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('initCookies$', () => {
    it('should fire initCookiesSuccess if successful', () => {
      actions$ = hot('a', { a: CookieActions.initCookies() });
      const expected$ = hot('a', {
        a: CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testBaseCsrfTokenAndDataDto1,
        }),
      });
      expect(effects.initCookies$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.initCookies).toBeCalledTimes(1);
        expect(service.initCookies).toBeCalledWith();
      });
    });

    it('should not fire if CSRF token is already set', () => {
      store.setState({
        cookie: {
          ...initialCookieState,
          csrfToken: testBaseCsrfTokenAndDataDto1.csrfToken,
        },
      });
      actions$ = hot('a', { a: CookieActions.initCookies() });
      const expected$ = hot('-');
      expect(effects.initCookies$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.initCookies).not.toBeCalled();
      });
    });
  });

  describe('initCookiesSuccess$', () => {
    it('should navigate to home', () => {
      actions$ = hot('a', {
        a: CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testBaseCsrfTokenAndDataDto1,
        }),
      });
      const expected$ = hot('a', {
        a: CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testBaseCsrfTokenAndDataDto1,
        }),
      });
      expect(effects.initCookiesSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith(['/']);
      });
    });
  });
});
