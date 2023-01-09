import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthActions,
  AuthenticatorActions,
  catchHttpError,
} from '@newbee/newbee/shared/data-access';
import {
  displayNameIsNotEmpty,
  emailIsEmail,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
  userChallengeEmailNotFound,
  userEmailNotFound,
  userEmailTakenBadRequest,
} from '@newbee/shared/util';
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
          catchError(AuthEffects.catchHttpError)
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
          catchError(AuthEffects.catchHttpError)
        );
      })
    );
  });

  postWebAuthnRegisterChallenge$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.postWebauthnRegisterChallenge),
      switchMap(({ registerForm }) => {
        return this.authService.webAuthnRegister(registerForm).pipe(
          map((userAndOptionsDto) => {
            return AuthActions.postWebauthnRegisterChallengeSuccess({
              userAndOptionsDto,
            });
          }),
          catchError(AuthEffects.catchHttpError)
        );
      })
    );
  });

  postWebAuthnRegisterChallengeSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.postWebauthnRegisterChallengeSuccess),
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
          catchError(AuthEffects.catchHttpError)
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
          catchError(AuthEffects.catchHttpError)
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /**
   * Helper function to feed into `catchError` to capture HTTP errors from responses, convert them to the internal `HttpClientError` format, and save them in the store.
   *
   * @param err The HTTP error from the response.
   * @returns An observable containing the `[Http] Client Error` action.
   */
  static catchHttpError(err: HttpErrorResponse) {
    return catchHttpError(err, (message) => {
      switch (message) {
        case userEmailTakenBadRequest:
        case userChallengeEmailNotFound:
        case emailIsEmail:
        case userEmailNotFound:
          return 'email';
        case phoneNumberIsPhoneNumber:
          return 'phoneNumber';
        case nameIsNotEmpty:
          return 'name';
        case displayNameIsNotEmpty:
          return 'displayName';
        default:
          return 'misc';
      }
    });
  }
}
