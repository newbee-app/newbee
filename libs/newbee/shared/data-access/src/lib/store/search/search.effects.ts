import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap } from 'rxjs';
import { catchHttpError } from '../../function';
import { SearchService } from '../../service';
import { organizationFeature } from '../organization';
import { SearchActions } from './search.actions';

/**
 * The effects tied to `SearchActions`.
 */
@Injectable()
export class SearchEffects {
  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.search),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ query }, selectedOrganization]) => {
        return this.searchService
          .search(query, selectedOrganization?.organization?.slug as string)
          .pipe(
            map((result) => {
              return SearchActions.searchSuccess({ result });
            }),
            catchError(SearchEffects.catchHttpError)
          );
      })
    );
  });

  suggest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.suggest),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ query }, selectedOrganization]) => {
        return this.searchService
          .suggest(query, selectedOrganization?.organization?.slug as string)
          .pipe(
            map((result) => {
              return SearchActions.suggestSuccess({ result });
            }),
            catchError(SearchEffects.catchHttpError)
          );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly store: Store
  ) {}

  /**
   * Helper function to feed into `catchError` to capture HTTP errors from responses, convert them to the internal `HttpClientError` format, and save them in the store.
   *
   * @param err The HTTP error from the response.
   * @returns An observable containing the `[Http] Client Error` action.
   */
  private static catchHttpError(err: HttpErrorResponse) {
    return catchHttpError(err, () => 'misc');
  }
}
