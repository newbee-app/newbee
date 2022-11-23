import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  AuthenticatorActions,
  HttpActions,
} from '@newbee/newbee/shared/data-access';
import { HttpClientError } from '@newbee/newbee/shared/util';
import {
  testAuthenticator1,
  testPublicKeyCredentialCreationOptions1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { AuthenticatorService } from '../authenticator.service';
import { AuthenticatorEffects } from './authenticator.effects';

describe('AuthenticatorEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: AuthenticatorEffects;
  let service: AuthenticatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticatorEffects,
        {
          provide: AuthenticatorService,
          useValue: createMock<AuthenticatorService>({
            createGet: jest
              .fn()
              .mockReturnValue(of(testPublicKeyCredentialCreationOptions1)),
            createPost: jest.fn().mockReturnValue(of(testAuthenticator1)),
          }),
        },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(AuthenticatorEffects);
    service = TestBed.inject(AuthenticatorService);
  });

  it('should be defined', () => {
    expect(actions$).toBeDefined();
    expect(effects).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getRegisterChallenge$', () => {
    it('should fire verifyRegisterChallenge if successful', () => {
      actions$ = hot('a', { a: AuthenticatorActions.getRegisterChallenge() });
      const expected$ = hot('a', {
        a: AuthenticatorActions.verifyRegisterChallenge({
          options: testPublicKeyCredentialCreationOptions1,
        }),
      });
      expect(effects.getRegisterChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createGet).toBeCalledTimes(1);
        expect(service.createGet).toBeCalledWith();
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.getRegisterChallenge$).toBeMarble('-');
      expect(actions$).toSatisfyOnFlush(() => {
        expect(service.createGet).not.toBeCalled();
      });
    });

    it('should fire a httpClientError if service throws an error', () => {
      const testError = new Error('createGet');
      jest
        .spyOn(service, 'createGet')
        .mockReturnValue(
          throwError(
            () => new HttpErrorResponse({ error: testError, status: 400 })
          )
        );

      actions$ = hot('a', { a: AuthenticatorActions.getRegisterChallenge() });
      const testHttpClientError: HttpClientError = {
        status: 400,
        error: testError,
      };
      const expected$ = hot('a', {
        a: HttpActions.clientError({ httpClientError: testHttpClientError }),
      });
      expect(effects.getRegisterChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createGet).toBeCalledTimes(1);
        expect(service.createGet).toBeCalledWith();
      });
    });
  });

  describe('verifyRegisterChallenge$', () => {
    it('should fire verifyRegisterChallengeSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthenticatorActions.verifyRegisterChallenge({
          options: testPublicKeyCredentialCreationOptions1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.verifyRegisterChallengeSuccess(),
      });
      expect(effects.verifyRegisterChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createPost).toBeCalledTimes(1);
        expect(service.createPost).toBeCalledWith(
          testPublicKeyCredentialCreationOptions1
        );
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.verifyRegisterChallenge$).toBeMarble('-');
      expect(actions$).toSatisfyOnFlush(() => {
        expect(service.createPost).not.toBeCalled();
      });
    });

    it('should fire a httpClientError if service throws an error', () => {
      const testError = new Error('createPost');
      jest
        .spyOn(service, 'createPost')
        .mockReturnValue(
          throwError(
            () => new HttpErrorResponse({ error: testError, status: 400 })
          )
        );

      actions$ = hot('a', {
        a: AuthenticatorActions.verifyRegisterChallenge({
          options: testPublicKeyCredentialCreationOptions1,
        }),
      });
      const testHttpClientError: HttpClientError = {
        status: 400,
        error: testError,
      };
      const expected$ = hot('a', {
        a: HttpActions.clientError({ httpClientError: testHttpClientError }),
      });
      expect(effects.verifyRegisterChallenge$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createPost).toBeCalledTimes(1);
        expect(service.createPost).toBeCalledWith(
          testPublicKeyCredentialCreationOptions1
        );
      });
    });
  });
});
