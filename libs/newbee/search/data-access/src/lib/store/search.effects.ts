import { Injectable } from '@angular/core';
import {
  catchHttpScreenError,
  organizationFeature,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import { defaultLimit } from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { SearchService } from '../search.service';

/**
 * The effects tied to `SearchActions`.
 */
@Injectable()
export class SearchEffects {
  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.search),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ query }, selectedOrganization]) => {
        if (!query.query) {
          return of(
            SearchActions.searchSuccess({
              results: {
                results: [],
                total: 0,
                offset: 0,
                limit: defaultLimit,
                suggestion: null,
              },
            }),
          );
        }

        return this.searchService
          .search(query, selectedOrganization?.organization.slug as string)
          .pipe(
            map((results) => {
              return SearchActions.searchSuccess({ results });
            }),
            catchError(catchHttpScreenError),
          );
      }),
    );
  });

  suggest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.suggest),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ query }, selectedOrganization]) => {
        if (!query.query) {
          return of(
            SearchActions.suggestSuccess({ results: { suggestions: [] } }),
          );
        }

        return this.searchService
          .suggest(query, selectedOrganization?.organization.slug as string)
          .pipe(
            map((results) => {
              return SearchActions.suggestSuccess({ results });
            }),
          );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly store: Store,
  ) {}
}
