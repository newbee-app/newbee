import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchHttpError, UserActions } from '@newbee/newbee/shared/data-access';
import {
  displayNameIsNotEmpty,
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
          catchError(UserEffects.catchHttpError)
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
          catchError(UserEffects.catchHttpError)
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

  /**
   * Helper function to feed into `catchError` to capture HTTP errors from responses, convert them to the internal `HttpClientError` format, and save them in the store.
   *
   * @param err The HTTP error from the response.
   * @returns An observable containing the `[Http] Client Error` action.
   */
  private static catchHttpError(err: HttpErrorResponse) {
    return catchHttpError(err, (message) => {
      switch (message) {
        case nameIsNotEmpty:
          return 'name';
        case displayNameIsNotEmpty:
          return 'displayName';
        case phoneNumberIsPhoneNumber:
          return 'phoneNumber';
        default:
          return 'misc';
      }
    });
  }
}
