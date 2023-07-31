import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthActions,
  AuthenticatorActions,
  catchHttpClientError,
  catchHttpScreenError,
  ToastActions,
} from '@newbee/newbee/shared/data-access';
import {
  errToHttpClientError,
  httpClientErrorToToast,
} from '@newbee/newbee/shared/util';
import {
  displayNameIsNotEmpty,
  emailIsEmail,
  Keyword,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
  userChallengeEmailNotFound,
  userEmailNotFound,
  userEmailTakenBadRequest,
} from '@newbee/shared/util';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth.service';

/**
 * The effects tied to `AuthActions`.
 */
@Injectable()
export class AuthEffects {
  sendLoginMagicLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.sendLoginMagicLink),
      switchMap(({ emailDto }) => {
        return this.authService.magicLinkLoginLogin(emailDto).pipe(
          map((magicLinkLoginDto) => {
            return AuthActions.sendLoginMagicLinkSuccess({ magicLinkLoginDto });
          }),
          tap(async () => {
            await this.router.navigate([
              `/${Keyword.Auth}/${Keyword.Login}/${Keyword.ConfirmEmail}`,
            ]);
          }),
          catchError((err) => catchHttpClientError(err, AuthEffects.sortErrMsg))
        );
      })
    );
  });

  confirmMagicLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.confirmMagicLink),
      switchMap(({ token }) => {
        return this.authService.magicLinkLogin(token).pipe(
          map((userRelation) => {
            return AuthActions.loginSuccess({ userRelation });
          }),
          catchError(catchHttpScreenError)
        );
      })
    );
  });

  registerWithWebauthn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.registerWithWebauthn),
      switchMap(({ createUserDto }) => {
        return this.authService.webAuthnRegister(createUserDto).pipe(
          map((userAndOptionsDto) => {
            return AuthActions.registerWithWebauthnSuccess({
              userRelationAndOptionsDto: userAndOptionsDto,
            });
          }),
          catchError((err) => catchHttpClientError(err, AuthEffects.sortErrMsg))
        );
      })
    );
  });

  registerWithWebauthnSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.registerWithWebauthnSuccess),
      map(({ userRelationAndOptionsDto: userCreatedDto }) => {
        return AuthenticatorActions.createAuthenticator({
          options: userCreatedDto.options,
          caller: Keyword.Auth,
        });
      }),
      tap(async () => {
        await this.router.navigate(['/']);
      })
    );
  });

  createWebauthnLoginOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.createWebauthnLoginOptions),
      switchMap(({ emailDto }) => {
        return this.authService.webAuthnLoginOptions(emailDto).pipe(
          map((options) => {
            return AuthActions.loginWithWebauthn({
              emailDto,
              options,
            });
          }),
          catchError((err) => catchHttpClientError(err, AuthEffects.sortErrMsg))
        );
      })
    );
  });

  loginWithWebauthn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginWithWebauthn),
      switchMap(({ emailDto, options }) => {
        return this.authService.webAuthnLogin(emailDto, options).pipe(
          map((userRelation) => {
            return AuthActions.loginSuccess({ userRelation });
          }),
          catchError((err) => catchHttpClientError(err, AuthEffects.sortErrMsg))
        );
      })
    );
  });

  loginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(async () => {
          await this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => {
        return this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((err) =>
            of(
              ToastActions.addToast({
                toast: httpClientErrorToToast(errToHttpClientError(err)),
              })
            )
          )
        );
      })
    );
  });

  logoutSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(async () => {
          await this.router.navigate([`/${Keyword.Auth}/${Keyword.Login}`]);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /**
   * Helper function to sort error messages.
   *
   * @param msg The error message to sort.
   *
   * @returns The key for the msg's value.
   */
  private static sortErrMsg(msg: string): string {
    switch (msg) {
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
        return Keyword.Misc;
    }
  }
}
