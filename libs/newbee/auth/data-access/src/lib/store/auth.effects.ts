import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthActions,
  AuthenticatorActions,
  catchHttpError,
} from '@newbee/newbee/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthEffects {
  sendLoginMagicLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.sendLoginMagicLink),
      switchMap(({ loginForm }) => {
        return this.authService.magicLinkLoginLogin(loginForm).pipe(
          map((magicLinkLoginDto) => {
            return AuthActions.sendLoginMagicLinkSuccess({ magicLinkLoginDto });
          }),
          tap(async () => {
            await this.router.navigate(['../confirm-email']);
          }),
          catchError(catchHttpError)
        );
      })
    );
  });

  confirmMagicLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.confirmMagicLink),
      switchMap(({ token }) => {
        return this.authService.magicLinkLogin(token).pipe(
          map((loginDto) => {
            return AuthActions.loginSuccess({ loginDto });
          }),
          tap(async () => {
            await this.router.navigate(['/']);
          }),
          catchError(catchHttpError)
        );
      })
    );
  });

  getWebAuthnRegisterChallenge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getWebauthnRegisterChallenge),
      switchMap(({ registerForm }) => {
        return this.authService.webAuthnRegister(registerForm).pipe(
          map((userCreatedDto) => {
            return AuthActions.getWebauthnRegisterChallengeSuccess({
              userCreatedDto,
            });
          }),
          catchError(catchHttpError)
        );
      })
    );
  });

  getWebAuthnRegisterChallengeSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getWebauthnRegisterChallengeSuccess),
      map(({ userCreatedDto }) => {
        return AuthenticatorActions.verifyRegisterChallenge({
          options: userCreatedDto.options,
        });
      }),
      tap(async () => {
        await this.router.navigate(['/']);
      })
    );
  });

  getWebAuthnLoginChallenge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getWebauthnLoginChallenge),
      switchMap(({ loginForm }) => {
        return this.authService.webAuthnLoginGet(loginForm).pipe(
          map((options) => {
            return AuthActions.verifyWebauthnLoginChallenge({
              loginForm,
              options,
            });
          }),
          catchError(catchHttpError)
        );
      })
    );
  });

  verifyWebAuthnLoginChallenge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.verifyWebauthnLoginChallenge),
      switchMap(({ loginForm, options }) => {
        return this.authService.webAuthnLoginPost(loginForm, options).pipe(
          map((loginDto) => {
            return AuthActions.loginSuccess({ loginDto });
          }),
          catchError(catchHttpError)
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
}
