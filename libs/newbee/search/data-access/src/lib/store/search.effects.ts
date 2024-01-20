import { Injectable } from '@angular/core';
import {
  catchHttpClientError,
  catchHttpScreenError,
  organizationFeature,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import { BaseQueryDto, emptyQueryResults, Keyword } from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { SearchService } from '../search.service';
import { selectSearchResultsAndOrg } from './search.selector';

/**
 * The effects tied to `SearchActions`.
 */
@Injectable()
export class SearchEffects {
  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.search, SearchActions.continueSearch),
      concatLatestFrom(() => this.store.select(selectSearchResultsAndOrg)),
      filter(([, { selectedOrganization }]) => !!selectedOrganization),
      switchMap(([action, { searchResults, selectedOrganization }]) => {
        const { type } = action;
        let queryDto: BaseQueryDto;
        switch (type) {
          case SearchActions.search.type: {
            const { query } = action;
            const { query: queryString, type, team } = query;
            if (!queryString) {
              return of(
                SearchActions.searchSuccess({
                  results: {
                    ...emptyQueryResults,
                    ...(type && { type }),
                    ...(team && { team }),
                  },
                }),
              );
            }

            queryDto = query;
            break;
          }
          case SearchActions.continueSearch.type: {
            if (!searchResults) {
              return of(
                SearchActions.continueSearchSuccess({
                  results: emptyQueryResults,
                }),
              );
            }

            const { total, offset, limit, query, type, team } = searchResults;
            if (total <= limit * (offset + 1)) {
              return of(
                SearchActions.continueSearchSuccess({ results: searchResults }),
              );
            }

            queryDto = {
              offset: offset + 1,
              limit,
              query,
              ...(type && { type }),
              ...(team && { team }),
            };
            break;
          }
        }

        return this.searchService
          .search(queryDto, selectedOrganization?.organization.slug as string)
          .pipe(
            map((results) => {
              switch (type) {
                case SearchActions.search.type:
                  return SearchActions.searchSuccess({ results });
                case SearchActions.continueSearch.type:
                  return SearchActions.continueSearchSuccess({ results });
              }
            }),
            catchError((err) => {
              switch (type) {
                case SearchActions.search.type:
                  return catchHttpScreenError(err);
                case SearchActions.continueSearch.type:
                  return catchHttpClientError(err, () => Keyword.Misc);
              }
            }),
          );
      }),
    );
  });

  suggest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.suggest, SearchActions.search),
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

        // Doesn't matter that we're potentially sending extra fields in the request in the case of search
        // because the backend automatically strips fields that weren't specified in the DTO
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
