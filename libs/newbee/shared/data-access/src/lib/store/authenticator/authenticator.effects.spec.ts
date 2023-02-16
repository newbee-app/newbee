import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import { HttpClientError } from '@newbee/newbee/shared/util';
import {
  testAuthenticator1,
  testPublicKeyCredentialCreationOptions1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { AuthenticatorService } from '../../service';
import { HttpActions } from '../http';
import { AuthenticatorActions } from './authenticator.actions';
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

  describe('createRegistrationOptions$', () => {
    it('should fire createAuthenticator if successful', () => {
      actions$ = hot('a', {
        a: AuthenticatorActions.createRegistrationOptions(),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.createAuthenticator({
          options: testPublicKeyCredentialCreationOptions1,
        }),
      });
      expect(effects.createRegistrationOptions$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createGet).toBeCalledTimes(1);
        expect(service.createGet).toBeCalledWith();
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.createRegistrationOptions$).toBeMarble('-');
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

      actions$ = hot('a', {
        a: AuthenticatorActions.createRegistrationOptions(),
      });
      const testHttpClientError: HttpClientError = {
        status: 400,
        messages: { misc: testError.message },
      };
      const expected$ = hot('a', {
        a: HttpActions.clientError({ httpClientError: testHttpClientError }),
      });
      expect(effects.createRegistrationOptions$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createGet).toBeCalledTimes(1);
        expect(service.createGet).toBeCalledWith();
      });
    });
  });

  describe('createAuthenticator$', () => {
    it('should fire createAuthenticatorSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthenticatorActions.createAuthenticator({
          options: testPublicKeyCredentialCreationOptions1,
        }),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.createAuthenticatorSuccess(),
      });
      expect(effects.createAuthenticator$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createPost).toBeCalledTimes(1);
        expect(service.createPost).toBeCalledWith(
          testPublicKeyCredentialCreationOptions1
        );
      });
    });

    it('should not fire when unrelated actions are dispatched', () => {
      actions$ = hot('a', { a: { type: 'Unknown' } });
      expect(effects.createAuthenticator$).toBeMarble('-');
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
        a: AuthenticatorActions.createAuthenticator({
          options: testPublicKeyCredentialCreationOptions1,
        }),
      });
      const testHttpClientError: HttpClientError = {
        status: 400,
        messages: { misc: testError.message },
      };
      const expected$ = hot('a', {
        a: HttpActions.clientError({ httpClientError: testHttpClientError }),
      });
      expect(effects.createAuthenticator$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createPost).toBeCalledTimes(1);
        expect(service.createPost).toBeCalledWith(
          testPublicKeyCredentialCreationOptions1
        );
      });
    });
  });
});
