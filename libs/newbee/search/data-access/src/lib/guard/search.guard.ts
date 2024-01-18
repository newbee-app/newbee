import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { SearchActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword, SolrEntryEnum, defaultLimit } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectSearchResultsAndScreenError } from '../store';

/**
 * A guard that fires the search request and only proceeds if it completes.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns `true` after the search result is returned or an error is thrown.
 */
export const searchGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean> => {
  const store = inject(Store);

  const query = route.paramMap.get(Keyword.Search) ?? '';
  const type = route.queryParamMap.get(Keyword.Type);
  const solrType =
    type && Object.values<string>(SolrEntryEnum).includes(type)
      ? (type as SolrEntryEnum)
      : null;
  const teamSlug = route.queryParamMap.get(ShortUrl.Team);

  store.dispatch(
    SearchActions.search({
      query: {
        offset: 0,
        limit: defaultLimit,
        query,
        ...(solrType && { type: solrType }),
        ...(teamSlug && { team: teamSlug }),
      },
    }),
  );

  return store.select(selectSearchResultsAndScreenError).pipe(
    skipWhile(
      ({ searchResults, screenError }) => !searchResults && !screenError,
    ),
    take(1),
    map(() => true),
  );
};
