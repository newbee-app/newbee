import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap } from 'rxjs';
import { catchHttpScreenError } from '../../function';
import { CookieService } from '../../service';
import { CookieActions } from './cookie.actions';
import { cookieFeature } from './cookie.reducer';

/**
 * The effects tied to `CookieActions`.
 */
@Injectable()
export class CookieEffects {
  initCookies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CookieActions.initCookies),
      concatLatestFrom(() => this.store.select(cookieFeature.selectCsrfToken)),
      filter(([, token]) => !token),
      switchMap(() => {
        return this.cookieService.initCookies().pipe(
          map((csrfTokenAndDataDto) => {
            return CookieActions.initCookiesSuccess({ csrfTokenAndDataDto });
          }),
          catchError(catchHttpScreenError)
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly cookieService: CookieService,
    private readonly store: Store
  ) {}
}
