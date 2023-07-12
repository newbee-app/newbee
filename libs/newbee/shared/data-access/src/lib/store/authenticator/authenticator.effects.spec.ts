import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  testAuthenticator1,
  testPublicKeyCredentialCreationOptions1,
} from '@newbee/shared/util';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { AuthenticatorService } from '../../service';
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
            getAuthenticators: jest
              .fn()
              .mockReturnValue(of([testAuthenticator1])),
            createOptions: jest
              .fn()
              .mockReturnValue(of(testPublicKeyCredentialCreationOptions1)),
            create: jest.fn().mockReturnValue(of(testAuthenticator1)),
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

  describe('getAuthenticators$', () => {
    it('should fire getAuthenticatorsSuccess if successful', () => {
      actions$ = hot('a', { a: AuthenticatorActions.getAuthenticators() });
      const expected$ = hot('a', {
        a: AuthenticatorActions.getAuthenticatorsSuccess({
          authenticators: [testAuthenticator1],
        }),
      });
      expect(effects.getAuthenticators$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.getAuthenticators).toBeCalledTimes(1);
        expect(service.getAuthenticators).toBeCalledWith();
      });
    });
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
        expect(service.createOptions).toBeCalledTimes(1);
        expect(service.createOptions).toBeCalledWith();
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
        a: AuthenticatorActions.createAuthenticatorSuccess({
          authenticator: testAuthenticator1,
        }),
      });
      expect(effects.createAuthenticator$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toBeCalledTimes(1);
        expect(service.create).toBeCalledWith(
          testPublicKeyCredentialCreationOptions1
        );
      });
    });
  });
});
