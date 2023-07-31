import { Injectable } from '@angular/core';
import { Keyword } from '@newbee/shared/util';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap } from 'rxjs';
import { catchHttpScreenError } from '../../function';
import { catchHttpClientError } from '../../function/catch-http-client-error.function';
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
            return AuthenticatorActions.createAuthenticator({
              options,
              caller: Keyword.Authenticator,
            });
          }),
          catchError((err) =>
            catchHttpClientError(
              err,
              () => `${Keyword.Authenticator}-${Keyword.New}`
            )
          )
        );
      })
    );
  });

  createAuthenticator$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthenticatorActions.createAuthenticator),
      concatMap(({ options, caller }) => {
        return this.authenticatorService.create(options).pipe(
          map((authenticator) => {
            return AuthenticatorActions.createAuthenticatorSuccess({
              authenticator,
            });
          }),
          catchError((err) =>
            catchHttpClientError(err, () => {
              switch (caller) {
                case Keyword.Auth:
                  return Keyword.Misc;
                case Keyword.Authenticator:
                  return `${Keyword.Authenticator}-${Keyword.New}`;
              }
            })
          )
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
          catchError((err) =>
            catchHttpClientError(
              err,
              () => `${Keyword.Authenticator}-${Keyword.Edit}-${id}`
            )
          )
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
          catchError((err) =>
            catchHttpClientError(
              err,
              () => `${Keyword.Authenticator}-${Keyword.Delete}-${id}`
            )
          )
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authenticatorService: AuthenticatorService
  ) {}
}
