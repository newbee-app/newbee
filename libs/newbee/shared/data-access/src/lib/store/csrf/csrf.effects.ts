import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap } from 'rxjs';
import { CsrfService } from '../../service';
import { catchHttpError } from '../http';
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
          catchError(catchHttpError)
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly csrfService: CsrfService,
    private readonly store: Store
  ) {}
}
