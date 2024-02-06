import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthActions,
  AuthenticatorActions,
  ToastActions,
  catchHttpClientError,
  catchHttpScreenError,
  catchToastError,
} from '@newbee/newbee/shared/data-access';
import {
  AlertType,
  Button,
  Toast,
  ToastXPosition,
  ToastYPosition,
  unverifiedUserEmailAlert,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  displayNameIsNotEmpty,
  emailIsEmail,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
  userEmailNotFound,
  userEmailTakenBadRequest,
} from '@newbee/shared/util';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
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
          catchError((err) =>
            catchHttpClientError(err, AuthEffects.sortErrMsg),
          ),
        );
      }),
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
          catchError(catchHttpScreenError),
        );
      }),
    );
  });

  registerWithWebAuthn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.registerWithWebAuthn),
      switchMap(({ createUserDto }) => {
        return this.authService.webAuthnRegister(createUserDto).pipe(
          map((userAndOptionsDto) => {
            return AuthActions.registerWithWebAuthnSuccess({
              userRelationAndOptionsDto: userAndOptionsDto,
            });
          }),
          catchError((err) =>
            catchHttpClientError(err, AuthEffects.sortErrMsg),
          ),
        );
      }),
    );
  });

  registerWithWebAuthnSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.registerWithWebAuthnSuccess),
      map(({ userRelationAndOptionsDto: userCreatedDto }) => {
        return AuthenticatorActions.createAuthenticator({
          options: userCreatedDto.options,
          caller: Keyword.Auth,
        });
      }),
      tap(async () => {
        await this.router.navigate(['/']);
      }),
    );
  });

  createWebAuthnLoginOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.createWebAuthnLoginOptions),
      switchMap(({ emailDto }) => {
        return this.authService.webAuthnLoginOptions(emailDto).pipe(
          map((options) => {
            return AuthActions.loginWithWebAuthn({
              emailDto,
              options,
            });
          }),
          catchError((err) =>
            catchHttpClientError(err, AuthEffects.sortErrMsg),
          ),
        );
      }),
    );
  });

  loginWithWebAuthn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginWithWebAuthn),
      switchMap(({ emailDto, options }) => {
        return this.authService.webAuthnLogin(emailDto, options).pipe(
          map((userRelation) => {
            return AuthActions.loginSuccess({ userRelation });
          }),
          catchError((err) =>
            catchHttpClientError(err, AuthEffects.sortErrMsg),
          ),
        );
      }),
    );
  });

  loginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(async () => {
        await this.router.navigate(['/']);
      }),
      filter(({ userRelation }) => !userRelation.user.emailVerified),
      map(() => {
        return ToastActions.addToast({
          toast: new Toast(
            unverifiedUserEmailAlert.header,
            unverifiedUserEmailAlert.text,
            AlertType.Warning,
            [ToastXPosition.Center, ToastYPosition.Bottom],
            3000,
            new Button(
              'User Settings',
              this.navigateToUser,
              null,
              false,
              false,
            ),
          ),
        });
      }),
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => {
        return this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(catchToastError),
        );
      }),
    );
  });

  logoutSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(async () => {
          await this.router.navigate([`/${Keyword.Auth}/${Keyword.Login}`]);
        }),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  /**
   * A helper function for navigating to the user route.
   */
  readonly navigateToUser = async (): Promise<void> => {
    await this.router.navigate([`/${Keyword.User}`]);
  };

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
