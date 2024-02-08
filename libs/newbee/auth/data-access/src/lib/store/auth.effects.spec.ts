import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  AuthActions,
  AuthenticatorActions,
  ToastActions,
} from '@newbee/newbee/shared/data-access';
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
  Keyword,
  testCreateUserDto1,
  testEmailDto1,
  testMagicLinkLoginDto1,
  testPublicKeyCredentialRequestOptions1,
  testUser2,
  testUserRelation1,
  testUserRelationAndOptionsDto1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { v4 } from 'uuid';
import { AuthService } from '../auth.service';
import { AuthEffects } from './auth.effects';

jest.mock('uuid', () => ({
  __esModule: true,
  v4: jest.fn(),
}));
const mockV4 = v4 as jest.Mock;

describe('AuthEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: AuthEffects;
  let router: Router;
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideRouter([{ path: '**', component: EmptyComponent }]),
        AuthEffects,
        {
          provide: AuthService,
          useValue: createMock<AuthService>({
            magicLinkLoginLogin: jest
              .fn()
              .mockReturnValue(of(testMagicLinkLoginDto1)),
            magicLinkLogin: jest.fn().mockReturnValue(of(testUserRelation1)),
            webAuthnRegister: jest
              .fn()
              .mockReturnValue(of(testUserRelationAndOptionsDto1)),
            webAuthnLoginOptions: jest
              .fn()
              .mockReturnValue(of(testPublicKeyCredentialRequestOptions1)),
            webAuthnLogin: jest.fn().mockReturnValue(of(testUserRelation1)),
            logout: jest.fn().mockReturnValue(of(null)),
          }),
        },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    router = TestBed.inject(Router);
    service = TestBed.inject(AuthService);

    jest.clearAllMocks();
    jest.spyOn(router, 'navigate');
    mockV4.mockReturnValue('1');
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(router).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('sendLoginMagicLink$', () => {
    it('should fire sendLoginMagicLinkSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.sendLoginMagicLink({ emailDto: testEmailDto1 }),
      });
      const expected$ = hot('a', {
        a: AuthActions.sendLoginMagicLinkSuccess({
          magicLinkLoginDto: testMagicLinkLoginDto1,
        }),
      });
      expect(effects.sendLoginMagicLink$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.magicLinkLoginLogin).toHaveBeenCalledTimes(1);
        expect(service.magicLinkLoginLogin).toHaveBeenCalledWith(testEmailDto1);
      });
    });
  });

  describe('confirmMagicLink$', () => {
    it('should fire loginSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.confirmMagicLink({ token: '1234' }),
      });
      const expected$ = hot('a', {
        a: AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
      });
      expect(effects.confirmMagicLink$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.magicLinkLogin).toHaveBeenCalledTimes(1);
        expect(service.magicLinkLogin).toHaveBeenCalledWith('1234');
      });
    });
  });

  describe('registerWithWebAuthn$', () => {
    it('should fire registerWithWebAuthnSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.registerWithWebAuthn({
          createUserDto: testCreateUserDto1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.registerWithWebAuthnSuccess({
          userRelationAndOptionsDto: testUserRelationAndOptionsDto1,
        }),
      });
      expect(effects.registerWithWebAuthn$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnRegister).toHaveBeenCalledTimes(1);
        expect(service.webAuthnRegister).toHaveBeenCalledWith(
          testCreateUserDto1,
        );
      });
    });
  });

  describe('registerWithWebAuthnSuccess$', () => {
    it('should fire verifyRegisterChallenge if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.registerWithWebAuthnSuccess({
          userRelationAndOptionsDto: testUserRelationAndOptionsDto1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.createAuthenticator({
          options: testUserRelationAndOptionsDto1.options,
          caller: Keyword.Auth,
        }),
      });
      expect(effects.registerWithWebAuthnSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.registerWithWebAuthnSuccess$).toBeMarble('-');
    });
  });

  describe('createWebAuthnLoginOptions$', () => {
    it('should fire loginWithWebAuthn if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.createWebAuthnLoginOptions({
          emailDto: testEmailDto1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.loginWithWebAuthn({
          emailDto: testEmailDto1,
          options: testPublicKeyCredentialRequestOptions1,
        }),
      });
      expect(effects.createWebAuthnLoginOptions$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLoginOptions).toHaveBeenCalledTimes(1);
        expect(service.webAuthnLoginOptions).toHaveBeenCalledWith(
          testEmailDto1,
        );
      });
    });
  });

  describe('loginWithWebAuthn$', () => {
    it('should fire loginSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.loginWithWebAuthn({
          emailDto: testEmailDto1,
          options: testPublicKeyCredentialRequestOptions1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.loginSuccess({
          userRelation: testUserRelation1,
        }),
      });
      expect(effects.loginWithWebAuthn$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLogin).toHaveBeenCalledTimes(1);
        expect(service.webAuthnLogin).toHaveBeenCalledWith(
          testEmailDto1,
          testPublicKeyCredentialRequestOptions1,
        );
      });
    });
  });

  describe('loginSuccess$', () => {
    it('should navigate to home', () => {
      actions$ = hot('a', {
        a: AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
      });
      const expected$ = hot('-');
      expect(effects.loginSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });

    it('should fire addToast is user email is unverified', () => {
      actions$ = hot('a', {
        a: AuthActions.loginSuccess({
          userRelation: { ...testUserRelation1, user: testUser2 },
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
      expect(effects.loginSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('logout$', () => {
    it('should fire logoutSuccess if successful', () => {
      actions$ = hot('a', { a: AuthActions.logout() });
      const expected$ = hot('a', { a: AuthActions.logoutSuccess() });
      expect(effects.logout$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.logout).toHaveBeenCalledTimes(1);
        expect(service.logout).toHaveBeenCalledWith();
      });
    });
  });

  describe('logoutSuccess$', () => {
    it('should navigate to home', () => {
      actions$ = hot('a', { a: AuthActions.logoutSuccess() });
      const expected$ = hot('a', { a: AuthActions.logoutSuccess() });
      expect(effects.logoutSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([
          `/${Keyword.Auth}/${Keyword.Login}`,
        ]);
      });
    });
  });
});
