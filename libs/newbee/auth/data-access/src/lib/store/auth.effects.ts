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

/**
 * The effects tied to `AuthActions`.
 */
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
            await this.router.navigate(['/auth/login/confirm-email']);
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
          map((user) => {
            return AuthActions.loginSuccess({ user });
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
              userAndOptionsDto: userCreatedDto,
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
      map(({ userAndOptionsDto: userCreatedDto }) => {
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
          map((user) => {
            return AuthActions.loginSuccess({ user });
          }),
          tap(async () => {
            await this.router.navigate(['/']);
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
