import { TestBed } from '@angular/core/testing';
import { createMock } from '@golevelup/ts-jest';
import {
  Keyword,
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
            editName: jest.fn().mockReturnValue(of(testAuthenticator1)),
            delete: jest.fn().mockReturnValue(of(null)),
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
        expect(service.getAuthenticators).toHaveBeenCalledTimes(1);
        expect(service.getAuthenticators).toHaveBeenCalledWith();
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
          caller: Keyword.Authenticator,
        }),
      });
      expect(effects.createRegistrationOptions$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.createOptions).toHaveBeenCalledTimes(1);
        expect(service.createOptions).toHaveBeenCalledWith();
      });
    });
  });

  describe('createAuthenticator$', () => {
    it('should fire createAuthenticatorSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthenticatorActions.createAuthenticator({
          options: testPublicKeyCredentialCreationOptions1,
          caller: Keyword.Authenticator,
        }),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.createAuthenticatorSuccess({
          authenticator: testAuthenticator1,
        }),
      });
      expect(effects.createAuthenticator$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.create).toHaveBeenCalledTimes(1);
        expect(service.create).toHaveBeenCalledWith(
          testPublicKeyCredentialCreationOptions1,
        );
      });
    });
  });

  describe('editAuthenticatorName$', () => {
    it('should fire editAuthenticatorNameSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthenticatorActions.editAuthenticatorName({
          id: testAuthenticator1.id,
          name: testAuthenticator1.name,
        }),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.editAuthenticatorNameSuccess({
          authenticator: testAuthenticator1,
        }),
      });
      expect(effects.editAuthenticatorName$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.editName).toHaveBeenCalledTimes(1);
        expect(service.editName).toHaveBeenCalledWith(
          testAuthenticator1.id,
          testAuthenticator1.name,
        );
      });
    });
  });

  describe('deleteAuthenticator$', () => {
    it('should fire deleteAuthenticatorSuccess if successful', () => {
      actions$ = hot('a', {
        a: AuthenticatorActions.deleteAuthenticator({
          id: testAuthenticator1.id,
        }),
      });
      const expected$ = hot('a', {
        a: AuthenticatorActions.deleteAuthenticatorSuccess({
          id: testAuthenticator1.id,
        }),
      });
      expect(effects.deleteAuthenticator$).toBeObservable(expected$);
      expect(expected$).toSatisfyOnFlush(() => {
        expect(service.delete).toHaveBeenCalledTimes(1);
        expect(service.delete).toHaveBeenCalledWith(testAuthenticator1.id);
      });
    });
  });
});
