import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientError } from '@newbee/newbee/shared/util';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  sendLoginMagicLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.sendLoginMagicLink),
      mergeMap(({ loginForm }) => {
        return this.authService.magicLinkLoginLogin(loginForm).pipe(
          map((magicLinkLoginDto) => {
            return AuthActions.sendLoginMagicLinkSuccess({ magicLinkLoginDto });
          }),
          catchError((err: HttpErrorResponse) => {
            const { status, error } = err;
            const httpClientError: HttpClientError = { status, error };
            return of(AuthActions.httpClientError({ httpClientError }));
          })
        );
      })
    );
  });

  getWebAuthnRegisterChallenge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getWebauthnRegisterChallenge),
      mergeMap(({ registerForm }) => {
        return this.authService.webAuthnRegister(registerForm).pipe(
          map((userCreatedDto) => {
            return AuthActions.getWebauthnRegisterChallengeSuccess({
              userCreatedDto,
            });
          }),
          catchError((err: HttpErrorResponse) => {
            const { status, error } = err;
            const httpClientError: HttpClientError = { status, error };
            return of(AuthActions.httpClientError({ httpClientError }));
          })
        );
      })
    );
  });

  getWebAuthnLoginChallenge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getWebauthnLoginChallenge),
      mergeMap(({ loginForm }) => {
        return this.authService.webAuthnLoginGet(loginForm).pipe(
          map((options) => {
            return AuthActions.verifyWebauthnLogin({ loginForm, options });
          }),
          catchError((err: HttpErrorResponse) => {
            const { status, error } = err;
            const httpClientError: HttpClientError = { status, error };
            return of(AuthActions.httpClientError({ httpClientError }));
          })
        );
      })
    );
  });

  verifyWebAuthnLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.verifyWebauthnLogin),
      mergeMap(({ loginForm, options }) => {
        return this.authService.webAuthnLoginPost(loginForm, options).pipe(
          map((loginDto) => {
            return AuthActions.loginSuccess({ loginDto });
          }),
          catchError((err: HttpErrorResponse) => {
            const { status, error } = err;
            const httpClientError: HttpClientError = { status, error };
            return of(AuthActions.httpClientError({ httpClientError }));
          })
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService
  ) {}
}
