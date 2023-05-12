import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
import { catchHttpError } from '../../function';
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
          catchError(CookieEffects.catchHttpError)
        );
      })
    );
  });

  initCookiesSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CookieActions.initCookiesSuccess),
        tap(async ({ csrfTokenAndDataDto }) => {
          if (csrfTokenAndDataDto.userRelation) {
            await this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly cookieService: CookieService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  /**
   * Helper function to feed into `catchError` to capture HTTP errors from responses, convert them to the internal `HttpClientError` format, and save them in the store.
   *
   * @param err The HTTP error from the response.
   * @returns An observable containing the `[Http] Client Error` action.
   */
  static catchHttpError(err: HttpErrorResponse) {
    return catchHttpError(err, () => 'misc');
  }
}
