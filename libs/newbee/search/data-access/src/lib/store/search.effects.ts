import { Injectable } from '@angular/core';
import {
  catchHttpScreenError,
  organizationFeature,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap } from 'rxjs';
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
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ query }, selectedOrganization]) => {
        return this.searchService
          .search(query, selectedOrganization?.slug as string)
          .pipe(
            map((result) => {
              return SearchActions.searchSuccess({ result });
            }),
            catchError(catchHttpScreenError)
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
          .suggest(query, selectedOrganization?.slug as string)
          .pipe(
            map((result) => {
              return SearchActions.suggestSuccess({ result });
            })
          );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly store: Store
  ) {}
}
