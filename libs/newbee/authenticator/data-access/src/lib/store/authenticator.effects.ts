import { Injectable } from '@angular/core';
import {
  AuthenticatorActions,
  catchHttpError,
} from '@newbee/newbee/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs';
import { AuthenticatorService } from '../authenticator.service';

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
          catchError(catchHttpError)
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
          catchError(catchHttpError)
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authenticatorService: AuthenticatorService
  ) {}
}
