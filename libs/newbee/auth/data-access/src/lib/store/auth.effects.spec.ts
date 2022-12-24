import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import { testLoginForm1, testRegisterForm1 } from '@newbee/newbee/auth/util';
import {
  AuthActions,
  AuthenticatorActions,
  HttpActions,
} from '@newbee/newbee/shared/data-access';
import { HttpClientError } from '@newbee/newbee/shared/util';
import {
  testBaseMagicLinkLoginDto1,
  testBaseUserAndOptionsDto1,
} from '@newbee/shared/data-access';
import {
  testPublicKeyCredentialRequestOptions1,
  testUser1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthEffects } from './auth.effects';

describe('AuthEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: AuthEffects;
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        {
          provide: AuthService,
          useValue: createMock<AuthService>({
            magicLinkLoginLogin: jest
              .fn()
              .mockReturnValue(of(testBaseMagicLinkLoginDto1)),
            magicLinkLogin: jest.fn().mockReturnValue(of(testUser1)),
            webAuthnRegister: jest
              .fn()
              .mockReturnValue(of(testBaseUserAndOptionsDto1)),
            webAuthnLoginGet: jest
              .fn()
              .mockReturnValue(of(testPublicKeyCredentialRequestOptions1)),
            webAuthnLoginPost: jest.fn().mockReturnValue(of(testUser1)),
          }),
        },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(AuthEffects);
    service = TestBed.inject(AuthService);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
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

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.sendLoginMagicLink$).toBeMarble('-');
      expect(actions$).toSatisfyOnFlush(() => {
        expect(service.magicLinkLoginLogin).not.toBeCalled();
      });
    });

    it('should fire a httpClientError if service throws an error', () => {
      const testError = new Error('magicLinkLoginLogin');
      jest.spyOn(service, 'magicLinkLoginLogin').mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: testError,
              status: 400,
            })
        )
      );

      actions$ = hot('a', {
        a: AuthActions.sendLoginMagicLink({ loginForm: testLoginForm1 }),
      });
      const testHttpClientError: HttpClientError = {
        status: 400,
        error: testError,
      };
      const expected$ = hot('a', {
        a: HttpActions.clientError({
          httpClientError: testHttpClientError,
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
        a: AuthActions.loginSuccess({ user: testUser1 }),
      });
      expect(effects.confirmMagicLink$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.magicLinkLogin).toBeCalledTimes(1);
        expect(service.magicLinkLogin).toBeCalledWith('1234');
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.confirmMagicLink$).toBeMarble('-');
      expect(actions$).toSatisfyOnFlush(() => {
        expect(service.magicLinkLogin).not.toBeCalled();
      });
    });

    it('should fire a httpClientError if service throws an error', () => {
      const testError = new Error('magicLinkLogin');
      jest.spyOn(service, 'magicLinkLogin').mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: testError,
              status: 400,
            })
        )
      );

      actions$ = hot('a', {
        a: AuthActions.confirmMagicLink({
          token: '1234',
        }),
      });
      const testHttpClientError: HttpClientError = {
        status: 400,
        error: testError,
      };
      const expected$ = hot('a', {
        a: HttpActions.clientError({
          httpClientError: testHttpClientError,
        }),
      });
      expect(effects.confirmMagicLink$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.magicLinkLogin).toBeCalledTimes(1);
        expect(service.magicLinkLogin).toBeCalledWith('1234');
      });
    });
  });

  describe('getWebAuthnRegisterChallenge$', () => {
    it('should fire getWebauthnRegisterChallengeSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.getWebauthnRegisterChallenge({
          registerForm: testRegisterForm1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.getWebauthnRegisterChallengeSuccess({
          userAndOptionsDto: testBaseUserAndOptionsDto1,
        }),
      });
      expect(effects.getWebAuthnRegisterChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnRegister).toBeCalledTimes(1);
        expect(service.webAuthnRegister).toBeCalledWith(testRegisterForm1);
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.getWebAuthnRegisterChallenge$).toBeMarble('-');
      expect(actions$).toSatisfyOnFlush(() => {
        expect(service.magicLinkLoginLogin).not.toBeCalled();
      });
    });

    it('should fire a httpClientError if service throws an error', () => {
      const testError = new Error('webAuthnRegister');
      jest.spyOn(service, 'webAuthnRegister').mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: testError,
              status: 400,
            })
        )
      );

      actions$ = hot('a', {
        a: AuthActions.getWebauthnRegisterChallenge({
          registerForm: testRegisterForm1,
        }),
      });
      const testHttpClientError: HttpClientError = {
        status: 400,
        error: testError,
      };
      const expected$ = hot('a', {
        a: HttpActions.clientError({
          httpClientError: testHttpClientError,
        }),
      });
      expect(effects.getWebAuthnRegisterChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnRegister).toBeCalledTimes(1);
        expect(service.webAuthnRegister).toBeCalledWith(testRegisterForm1);
      });
    });
  });

  describe('getWebAuthnRegisterChallengeSuccess$', () => {
    it('should fire verifyRegisterChallenge if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.getWebauthnRegisterChallengeSuccess({
          userAndOptionsDto: testBaseUserAndOptionsDto1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.verifyRegisterChallenge({
          options: testBaseUserAndOptionsDto1.options,
        }),
      });
      expect(effects.getWebAuthnRegisterChallengeSuccess$).toBeObservable(
        expected$
      );
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.getWebAuthnRegisterChallengeSuccess$).toBeMarble('-');
    });
  });

  describe('getWebAuthnLoginChallenge$', () => {
    it('should fire verifyWebauthnLogiChallenge if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.getWebauthnLoginChallenge({
          loginForm: testLoginForm1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.verifyWebauthnLoginChallenge({
          loginForm: testLoginForm1,
          options: testPublicKeyCredentialRequestOptions1,
        }),
      });
      expect(effects.getWebAuthnLoginChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLoginGet).toBeCalledTimes(1);
        expect(service.webAuthnLoginGet).toBeCalledWith(testLoginForm1);
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.getWebAuthnLoginChallenge$).toBeMarble('-');
      expect(actions$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLoginGet).not.toBeCalled();
      });
    });

    it('should fire a httpClientError if service throws an error', () => {
      const testError = new Error('webAuthnLoginGet');
      jest.spyOn(service, 'webAuthnLoginGet').mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: testError,
              status: 400,
            })
        )
      );

      actions$ = hot('a', {
        a: AuthActions.getWebauthnLoginChallenge({
          loginForm: testLoginForm1,
        }),
      });
      const testHttpClientError: HttpClientError = {
        status: 400,
        error: testError,
      };
      const expected$ = hot('a', {
        a: HttpActions.clientError({
          httpClientError: testHttpClientError,
        }),
      });
      expect(effects.getWebAuthnLoginChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLoginGet).toBeCalledTimes(1);
        expect(service.webAuthnLoginGet).toBeCalledWith(testLoginForm1);
      });
    });
  });

  describe('verifyWebAuthnLoginChallenge$', () => {
    it('should fire loginSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthActions.verifyWebauthnLoginChallenge({
          loginForm: testLoginForm1,
          options: testPublicKeyCredentialRequestOptions1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthActions.loginSuccess({
          user: testUser1,
        }),
      });
      expect(effects.verifyWebAuthnLoginChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLoginPost).toBeCalledTimes(1);
        expect(service.webAuthnLoginPost).toBeCalledWith(
          testLoginForm1,
          testPublicKeyCredentialRequestOptions1
        );
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.verifyWebAuthnLoginChallenge$).toBeMarble('-');
      expect(actions$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLoginPost).not.toBeCalled();
      });
    });

    it('should fire a httpClientError if service throws an error', () => {
      const testError = new Error('webAuthnLoginPost');
      jest.spyOn(service, 'webAuthnLoginPost').mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: testError,
              status: 400,
            })
        )
      );

      actions$ = hot('a', {
        a: AuthActions.verifyWebauthnLoginChallenge({
          loginForm: testLoginForm1,
          options: testPublicKeyCredentialRequestOptions1,
        }),
      });
      const testHttpClientError: HttpClientError = {
        status: 400,
        error: testError,
      };
      const expected$ = hot('a', {
        a: HttpActions.clientError({
          httpClientError: testHttpClientError,
        }),
      });
      expect(effects.verifyWebAuthnLoginChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.webAuthnLoginPost).toBeCalledTimes(1);
        expect(service.webAuthnLoginPost).toBeCalledWith(
          testLoginForm1,
          testPublicKeyCredentialRequestOptions1
        );
      });
    });
  });
});
