import { Injectable } from '@angular/core';
import {
  catchHttpClientError,
  catchHttpScreenError,
  organizationFeature,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import { canGetMoreResults } from '@newbee/newbee/shared/util';
import { BaseQueryDto, Keyword, QueryResults } from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap } from 'rxjs';
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
      filter(
        ([action, { searchResults, selectedOrganization }]) =>
          !!(
            selectedOrganization &&
            ((action.type === SearchActions.search.type &&
              action.query.query) ||
              (action.type === SearchActions.continueSearch.type &&
                searchResults &&
                canGetMoreResults(searchResults)))
          ),
      ),
      switchMap(([action, { searchResults, selectedOrganization }]) => {
        const { type } = action;
        let queryDto: BaseQueryDto;
        switch (type) {
          case SearchActions.search.type:
            queryDto = action.query;
            break;
          case SearchActions.continueSearch.type: {
            const { offset, limit, query, type, team } =
              searchResults as QueryResults;
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
      filter(
        ([{ query }, selectedOrganization]) =>
          !!(selectedOrganization && query.query),
      ),
      switchMap(([{ query }, selectedOrganization]) => {
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
