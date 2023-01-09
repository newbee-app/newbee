import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap } from 'rxjs';
import { catchHttpError } from '../../function';
import { CsrfService } from '../../service';
import { CsrfActions } from './csrf.actions';
import { csrfFeature } from './csrf.reducer';

/**
 * The effects tied to `CsrfActions`.
 */
@Injectable()
export class CsrfEffects {
  getCsrfToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CsrfActions.getCsrfToken),
      concatLatestFrom(() => this.store.select(csrfFeature.selectCsrfToken)),
      filter(([, token]) => !token),
      switchMap(() => {
        return this.csrfService.createToken().pipe(
          map((csrfTokenDto) => {
            return CsrfActions.getCsrfTokenSuccess({ csrfTokenDto });
          }),
          catchError(CsrfEffects.catchHttpError)
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly csrfService: CsrfService,
    private readonly store: Store
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
