import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  authFeature,
  catchHttpClientError,
  catchHttpScreenError,
  ToastActions,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import {
  AlertType,
  Toast,
  ToastXPosition,
  ToastYPosition,
} from '@newbee/newbee/shared/util';
import {
  displayNameIsNotEmpty,
  Keyword,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
import { UserService } from '../user.service';

/**
 * The effects tied to `UserActions`.
 */
@Injectable()
export class UserEffects {
  editUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.editUser),
      switchMap(({ updateUserDto }) => {
        return this.userService.edit(updateUserDto).pipe(
          map((user) => {
            return UserActions.editUserSuccess({ user });
          }),
          catchError((err) =>
            catchHttpClientError(err, (msg) => {
              switch (msg) {
                case nameIsNotEmpty:
                  return 'name';
                case displayNameIsNotEmpty:
                  return 'displayName';
                case phoneNumberIsPhoneNumber:
                  return 'phoneNumber';
                default:
                  return `${Keyword.User}-${Keyword.Edit}`;
              }
            }),
          ),
        );
      }),
    );
  });

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteUser),
      switchMap(() => {
        return this.userService.delete().pipe(
          map(() => {
            return UserActions.deleteUserSuccess();
          }),
          catchError((err) =>
            catchHttpClientError(
              err,
              () => `${Keyword.User}-${Keyword.Delete}`,
            ),
          ),
        );
      }),
    );
  });

  deleteUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.deleteUserSuccess),
        tap(async () => {
          await this.router.navigate(['/']);
        }),
      );
    },
    { dispatch: false },
  );

  verifyEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.verifyEmail),
      switchMap(({ token }) => {
        return this.userService.verifyEmail(token).pipe(
          map((user) => {
            return UserActions.verifyEmailSuccess({ user });
          }),
          catchError(catchHttpScreenError),
        );
      }),
    );
  });

  verifyEmailSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.verifyEmailSuccess),
      tap(async () => {
        await this.router.navigate(['/']);
      }),
      map(({ user }) => {
        return ToastActions.addToast({
          toast: new Toast(
            `Successfully verified ${user.email}`,
            '',
            AlertType.Success,
            [ToastXPosition.Center, ToastYPosition.Bottom],
            3000,
            null,
          ),
        });
      }),
    );
  });

  sendVerificationEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.sendVerificationEmail),
      switchMap(() => {
        return this.userService.sendVerificationEmail().pipe(
          map(() => {
            return UserActions.sendVerificationEmailSuccess();
          }),
          catchError((err) => catchHttpClientError(err, () => Keyword.Verify)),
        );
      }),
    );
  });

  sendVerificationEmailSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.sendVerificationEmailSuccess),
      concatLatestFrom(() => this.store.select(authFeature.selectUser)),
      filter(([, user]) => !!user),
      map(([, user]) => {
        return ToastActions.addToast({
          toast: new Toast(
            `Successfully sent verification email to ${user?.email}`,
            'Please check your inbox',
            AlertType.Success,
            [ToastXPosition.Center, ToastYPosition.Bottom],
            3000,
            null,
          ),
        });
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}
}
