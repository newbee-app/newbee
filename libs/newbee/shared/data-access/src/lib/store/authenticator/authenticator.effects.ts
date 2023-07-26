import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  authenticatorTakenBadRequest,
  authenticatorVerifyBadRequest,
  Keyword,
  userChallengeIdNotFound,
} from '@newbee/shared/util';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap } from 'rxjs';
import { catchHttpError, catchHttpScreenError } from '../../function';
import { AuthenticatorService } from '../../service';
import { AuthenticatorActions } from './authenticator.actions';

/**
 * The effects tied to `AuthenticatorActions`.
 */
@Injectable()
export class AuthenticatorEffects {
  getAuthenticators$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthenticatorActions.getAuthenticators),
      switchMap(() => {
        return this.authenticatorService.getAuthenticators().pipe(
          map((authenticators) => {
            return AuthenticatorActions.getAuthenticatorsSuccess({
              authenticators,
            });
          }),
          catchError(catchHttpScreenError)
        );
      })
    );
  });

  createRegistrationOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthenticatorActions.createRegistrationOptions),
      switchMap(() => {
        return this.authenticatorService.createOptions().pipe(
          map((options) => {
            return AuthenticatorActions.createAuthenticator({ options });
          }),
          catchError(AuthenticatorEffects.catchHttpError)
        );
      })
    );
  });

  createAuthenticator$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthenticatorActions.createAuthenticator),
      concatMap(({ options }) => {
        return this.authenticatorService.create(options).pipe(
          map((authenticator) => {
            return AuthenticatorActions.createAuthenticatorSuccess({
              authenticator,
            });
          }),
          catchError(AuthenticatorEffects.catchHttpError)
        );
      })
    );
  });

  editAuthenticatorName$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthenticatorActions.editAuthenticatorName),
      concatMap(({ id, name }) => {
        return this.authenticatorService.editName(id, name).pipe(
          map((authenticator) => {
            return AuthenticatorActions.editAuthenticatorNameSuccess({
              authenticator,
            });
          }),
          catchError(AuthenticatorEffects.catchHttpError)
        );
      })
    );
  });

  deleteAuthenticator$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthenticatorActions.deleteAuthenticator),
      concatMap(({ id }) => {
        return this.authenticatorService.delete(id).pipe(
          map(() => {
            return AuthenticatorActions.deleteAuthenticatorSuccess({ id });
          }),
          catchError(AuthenticatorEffects.catchHttpError)
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authenticatorService: AuthenticatorService
  ) {}

  static catchHttpError(err: HttpErrorResponse) {
    return catchHttpError(err, (message) => {
      switch (message) {
        case userChallengeIdNotFound:
        case authenticatorVerifyBadRequest:
        case authenticatorTakenBadRequest:
          return `${Keyword.New}-${Keyword.Authenticator}`;
        default:
          return 'misc';
      }
    });
  }
}
