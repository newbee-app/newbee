import { Injectable } from '@angular/core';
import { AuthActions } from '@newbee/newbee/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  sendMagicLink$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.sendMagicLink),
      mergeMap(({ email }) => {
        return this.authService.login({ email: email ?? '' }).pipe(
          map((magicLinkLoginDto) => {
            return AuthActions.sendMagicLinkSuccess(magicLinkLoginDto);
          }),
          catchError(() => of(AuthActions.sendMagicLinkError()))
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService
  ) {}
}
