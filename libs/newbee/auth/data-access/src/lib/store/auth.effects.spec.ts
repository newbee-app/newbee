import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { testLoginForm1, testRegisterForm1 } from '@newbee/newbee/auth/util';
import {
  AuthActions,
  AuthenticatorActions,
} from '@newbee/newbee/shared/data-access';
import {
  testBaseMagicLinkLoginDto1,
  testBaseUserRelationAndOptionsDto1,
} from '@newbee/shared/data-access';
import {
  testPublicKeyCredentialRequestOptions1,
  testUserRelation1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthEffects } from './auth.effects';

describe('AuthEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: AuthEffects;
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        AuthEffects,
        {
          provide: AuthService,
          useValue: createMock<AuthService>({
            magicLinkLoginLogin: jest
              .fn()
              .mockReturnValue(of(testBaseMagicLinkLoginDto1)),
            magicLinkLogin: jest.fn().mockReturnValue(of(testUserRelation1)),
            webAuthnRegister: jest
              .fn()
              .mockReturnValue(of(testBaseUserRelationAndOptionsDto1)),
            webAuthnLoginOptions: jest
              .fn()
              .mockReturnValue(of(testPublicKeyCredentialRequestOptions1)),
            webAuthnLogin: jest.fn().mockReturnValue(of(testUserRelation1)),
            logout: jest.fn().mockReturnValue(of(null)),
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

    effects = TestBed.inject(AuthEffects);
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
    expect(router).toBeDefined();
  });

  describe('sendLoginMagicLink$', () => {
    it('should fire sendLoginMagicLinkSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.sendLoginMagicLink({ loginForm: testLoginForm1 }),
      });
      const expected$ = hot('a', {
        a: AuthActions.sendLoginMagicLinkSuccess({
          magicLinkLoginDto: testBaseMagicLinkLoginDto1,
        }),
      });
      expect(effects.sendLoginMagicLink$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.magicLinkLoginLogin).toBeCalledTimes(1);
        expect(service.magicLinkLoginLogin).toBeCalledWith(testLoginForm1);
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
        expect(service.magicLinkLogin).toBeCalledTimes(1);
        expect(service.magicLinkLogin).toBeCalledWith('1234');
      });
    });
  });

  describe('registerWithWebauthn$', () => {
    it('should fire registerWithWebauthnSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.registerWithWebauthn({
          registerForm: testRegisterForm1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.registerWithWebauthnSuccess({
          userRelationAndOptionsDto: testBaseUserRelationAndOptionsDto1,
        }),
      });
      expect(effects.registerWithWebauthn$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnRegister).toBeCalledTimes(1);
        expect(service.webAuthnRegister).toBeCalledWith(testRegisterForm1);
      });
    });
  });

  describe('registerWithWebauthnSuccess$', () => {
    it('should fire verifyRegisterChallenge if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.registerWithWebauthnSuccess({
          userRelationAndOptionsDto: testBaseUserRelationAndOptionsDto1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.createAuthenticator({
          options: testBaseUserRelationAndOptionsDto1.options,
        }),
      });
      expect(effects.registerWithWebauthnSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith(['/']);
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.registerWithWebauthnSuccess$).toBeMarble('-');
    });
  });

  describe('createWebauthnLoginOptions$', () => {
    it('should fire loginWithWebauthn if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.createWebauthnLoginOptions({
          loginForm: testLoginForm1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.loginWithWebauthn({
          loginForm: testLoginForm1,
          options: testPublicKeyCredentialRequestOptions1,
        }),
      });
      expect(effects.createWebauthnLoginOptions$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLoginOptions).toBeCalledTimes(1);
        expect(service.webAuthnLoginOptions).toBeCalledWith(testLoginForm1);
      });
    });
  });

  describe('loginWithWebauthn$', () => {
    it('should fire loginSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.loginWithWebauthn({
          loginForm: testLoginForm1,
          options: testPublicKeyCredentialRequestOptions1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.loginSuccess({
          userRelation: testUserRelation1,
        }),
      });
      expect(effects.loginWithWebauthn$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLogin).toBeCalledTimes(1);
        expect(service.webAuthnLogin).toBeCalledWith(
          testLoginForm1,
          testPublicKeyCredentialRequestOptions1
        );
      });
    });
  });

  describe('loginSuccess$', () => {
    it('should navigate to home', () => {
      actions$ = hot('a', {
        a: AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
      });
      const expected$ = hot('a', {
        a: AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
      });
      expect(effects.loginSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith(['/']);
      });
    });
  });

  describe('logout$', () => {
    it('should fire logoutSuccess if successful', () => {
      actions$ = hot('a', { a: AuthActions.logout() });
      const expected$ = hot('a', { a: AuthActions.logoutSuccess() });
      expect(effects.logout$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.logout).toBeCalledTimes(1);
        expect(service.logout).toBeCalledWith();
      });
    });
  });

  describe('logoutSuccess$', () => {
    it('should navigate to home', () => {
      actions$ = hot('a', { a: AuthActions.logoutSuccess() });
      const expected$ = hot('a', { a: AuthActions.logoutSuccess() });
      expect(effects.logoutSuccess$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toBeCalledWith(['/auth/login']);
      });
    });
  });
});
