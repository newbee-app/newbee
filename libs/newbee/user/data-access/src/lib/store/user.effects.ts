import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpClientError,
  UserActions,
} from '@newbee/newbee/shared/data-access';
import {
  displayNameIsNotEmpty,
  Keyword,
  nameIsNotEmpty,
  phoneNumberIsPhoneNumber,
} from '@newbee/shared/util';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs';
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
            })
          )
        );
      })
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
            catchHttpClientError(err, () => `${Keyword.User}-${Keyword.Delete}`)
          )
        );
      })
    );
  });

  deleteUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.deleteUserSuccess),
        tap(async () => {
          await this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}
}
