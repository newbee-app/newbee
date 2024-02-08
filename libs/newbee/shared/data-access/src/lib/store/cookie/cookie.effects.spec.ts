import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  Button,
  Toast,
  ToastXPosition,
  ToastYPosition,
  unverifiedUserEmailAlert,
} from '@newbee/newbee/shared/util';
import {
  testCsrfTokenAndDataDto1,
  testUser2,
  testUserRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { v4 } from 'uuid';
import { CookieService } from '../../service';
import { ToastActions } from '../toast';
import { CookieActions } from './cookie.actions';
import { CookieEffects } from './cookie.effects';
import { initialCookieState } from './cookie.reducer';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('CookieEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: CookieEffects;
  let store: MockStore;
  let router: Router;
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { cookie: initialCookieState } }),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        CookieEffects,
        {
          provide: CookieService,
          useValue: createMock<CookieService>({
            initCookies: jest
              .fn()
              .mockReturnValue(of(testCsrfTokenAndDataDto1)),
          }),
        },
      ],
    });

    effects = TestBed.inject(CookieEffects);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    service = TestBed.inject(CookieService);

    jest.clearAllMocks();
    jest.spyOn(router, 'navigate');
    mockV4.mockReturnValue('1');
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(store).toBeDefined();
    expect(router).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('initCookies$', () => {
    it('should fire initCookiesSuccess if successful', () => {
      actions$ = hot('a', { a: CookieActions.initCookies() });
      const expected$ = hot('a', {
        a: CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testCsrfTokenAndDataDto1,
        }),
      });
      expect(effects.initCookies$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.initCookies).toHaveBeenCalledTimes(1);
        expect(service.initCookies).toHaveBeenCalledWith();
      });
    });

    it('should not fire if CSRF token is already set', () => {
      store.setState({
        cookie: {
          ...initialCookieState,
          csrfToken: testCsrfTokenAndDataDto1.csrfToken,
        },
      });
      actions$ = hot('a', { a: CookieActions.initCookies() });
      const expected$ = hot('-');
      expect(effects.initCookies$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.initCookies).not.toHaveBeenCalled();
      });
    });
  });

  describe('initCookiesSuccess$', () => {
    it('should fire addToast if user email is not verified', () => {
      actions$ = hot('a', {
        a: CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: {
            ...testCsrfTokenAndDataDto1,
            userRelation: { ...testUserRelation1, user: testUser2 },
          },
        }),
      });
      const expected$ = hot('a', {
        a: ToastActions.addToast({
          toast: new Toast(
            unverifiedUserEmailAlert.header,
            unverifiedUserEmailAlert.text,
            AlertType.Warning,
            [ToastXPosition.Center, ToastYPosition.Bottom],
            3000,
            new Button(
              'User Settings',
              effects.navigateToUser,
              null,
              false,
              false,
            ),
          ),
        }),
      });
      expect(effects.initCookiesSuccess$).toBeObservable(expected$);
    });

    it('should do nothing if user email is verified', () => {
      actions$ = hot('a', {
        a: CookieActions.initCookiesSuccess({
          csrfTokenAndDataDto: testCsrfTokenAndDataDto1,
        }),
      });
      const expected$ = hot('-');
      expect(effects.initCookiesSuccess$).toBeObservable(expected$);
    });
  });
});
