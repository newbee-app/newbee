import { Injectable } from '@angular/core';
import {
  catchHttpClientError,
  catchHttpScreenError,
  organizationFeature,
  SearchActions,
} from '@newbee/newbee/shared/data-access';
import { canGetMoreResults } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgSearchDto,
  OrgSearchResultsDto,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap } from 'rxjs';
import { SearchService } from '../search.service';
import { selectSearchResultsOrgAndError } from './search.selector';

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
      filter(
        ([{ query }, selectedOrganization]) =>
          !!(selectedOrganization && query.query),
      ),
      switchMap(([{ query }, selectedOrganization]) => {
        return this.searchService
          .search(query, selectedOrganization?.organization.slug as string)
          .pipe(
            map((results) => {
              return SearchActions.searchSuccess({ results });
            }),
            catchError((err) => catchHttpScreenError(err)),
          );
      }),
    );
  });

  continueSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.continueSearch),
      concatLatestFrom(() => this.store.select(selectSearchResultsOrgAndError)),
      filter(
        ([, { searchResults, selectedOrganization, error }]) =>
          !!(
            selectedOrganization &&
            searchResults &&
            canGetMoreResults(searchResults) &&
            !error
          ),
      ),
      map(() => SearchActions.continueSearchPending()),
    );
  });

  continueSearchPending$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.continueSearchPending),
      concatLatestFrom(() => this.store.select(selectSearchResultsOrgAndError)),
      switchMap(([, { searchResults, selectedOrganization }]) => {
        const { offset } = searchResults as OrgSearchResultsDto;

        // The backend will strip all of the fields that aren't actually in the DTO
        const queryDto = new OrgSearchDto();
        Object.assign(queryDto, searchResults);
        queryDto.offset = offset + 1;

        return this.searchService
          .search(queryDto, selectedOrganization?.organization.slug as string)
          .pipe(
            map((results) => {
              return SearchActions.continueSearchSuccess({ results });
            }),
            catchError((err) => catchHttpClientError(err, () => Keyword.Misc)),
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
