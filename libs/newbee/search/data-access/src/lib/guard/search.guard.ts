import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import {
  httpFeature,
  SearchActions,
  searchFeature,
} from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';

/**
 * A guard that fires the search request and only proceeds if it completes.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns `true` after the search result is returned or an error is thrown.
 */
export const searchGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const store = inject(Store);

  const query = route.paramMap.get(Keyword.Search) ?? '';
  store.dispatch(SearchActions.search({ query: { offset: 0, query } }));
  store.dispatch(SearchActions.suggest({ query: { query } }));

  return combineLatest([
    store.select(searchFeature.selectSearchResult),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(([searchResult, screenError]) => !searchResult && !screenError),
    take(1),
    map(() => true)
  );
};
