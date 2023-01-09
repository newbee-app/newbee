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
  getRegisterChallenge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthenticatorActions.getRegisterChallenge),
      switchMap(() => {
        return this.authenticatorService.createGet().pipe(
          map((options) => {
            return AuthenticatorActions.verifyRegisterChallenge({ options });
          }),
          catchError(AuthenticatorEffects.catchHttpError)
        );
      })
    );
  });

  verifyRegisterChallenge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthenticatorActions.verifyRegisterChallenge),
      switchMap(({ options }) => {
        return this.authenticatorService.createPost(options).pipe(
          map(() => {
            return AuthenticatorActions.verifyRegisterChallengeSuccess();
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
