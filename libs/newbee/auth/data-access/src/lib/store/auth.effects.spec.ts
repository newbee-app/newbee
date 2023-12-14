import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import {
  AuthActions,
  AuthenticatorActions,
} from '@newbee/newbee/shared/data-access';
import { EmptyComponent } from '@newbee/newbee/shared/ui';
import {
  Keyword,
  testBaseCreateUserDto1,
  testBaseEmailDto1,
  testBaseMagicLinkLoginDto1,
  testBaseUserRelationAndOptionsDto1,
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
        provideRouter([{ path: '**', component: EmptyComponent }]),
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
      ],
    });

    effects = TestBed.inject(AuthEffects);
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate');
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
        a: AuthActions.sendLoginMagicLink({ emailDto: testBaseEmailDto1 }),
      });
      const expected$ = hot('a', {
        a: AuthActions.sendLoginMagicLinkSuccess({
          magicLinkLoginDto: testBaseMagicLinkLoginDto1,
        }),
      });
      expect(effects.sendLoginMagicLink$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.magicLinkLoginLogin).toHaveBeenCalledTimes(1);
        expect(service.magicLinkLoginLogin).toHaveBeenCalledWith(
          testBaseEmailDto1,
        );
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
          createUserDto: testBaseCreateUserDto1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.registerWithWebAuthnSuccess({
          userRelationAndOptionsDto: testBaseUserRelationAndOptionsDto1,
        }),
      });
      expect(effects.registerWithWebAuthn$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnRegister).toHaveBeenCalledTimes(1);
        expect(service.webAuthnRegister).toHaveBeenCalledWith(
          testBaseCreateUserDto1,
        );
      });
    });
  });

  describe('registerWithWebAuthnSuccess$', () => {
    it('should fire verifyRegisterChallenge if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.registerWithWebAuthnSuccess({
          userRelationAndOptionsDto: testBaseUserRelationAndOptionsDto1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.createAuthenticator({
          options: testBaseUserRelationAndOptionsDto1.options,
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
          emailDto: testBaseEmailDto1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.loginWithWebAuthn({
          emailDto: testBaseEmailDto1,
          options: testPublicKeyCredentialRequestOptions1,
        }),
      });
      expect(effects.createWebAuthnLoginOptions$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLoginOptions).toHaveBeenCalledTimes(1);
        expect(service.webAuthnLoginOptions).toHaveBeenCalledWith(
          testBaseEmailDto1,
        );
      });
    });
  });

  describe('loginWithWebAuthn$', () => {
    it('should fire loginSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.loginWithWebAuthn({
          emailDto: testBaseEmailDto1,
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
          testBaseEmailDto1,
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
      const expected$ = hot('a', {
        a: AuthActions.loginSuccess({ userRelation: testUserRelation1 }),
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
