import { Injectable } from '@angular/core';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  sendLoginMagicLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.sendLoginMagicLink),
      mergeMap(({ email }) => {
        return this.authService.login({ email: email ?? '' }).pipe(
          map((magicLinkLoginDto) => {
            return AuthActions.sendLoginMagicLinkSuccess(magicLinkLoginDto);
          }),
          catchError(() => of(AuthActions.sendLoginMagicLinkError()))
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService
  ) {}
}
