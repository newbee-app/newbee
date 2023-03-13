import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import { catchHttpError } from '../../function';
import { AuthenticatorService } from '../../service';
import { AuthenticatorActions } from './authenticator.actions';

/**
 * The effects tied to `AuthenticatorActions`.
 */
@Injectable()
export class AuthenticatorEffects {
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
      switchMap(({ options }) => {
        return this.authenticatorService.create(options).pipe(
          map(() => {
            return AuthenticatorActions.createAuthenticatorSuccess();
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
    return catchHttpError(err, () => 'misc');
  }
}
