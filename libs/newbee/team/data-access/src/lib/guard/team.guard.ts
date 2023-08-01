import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import {
  httpFeature,
  ShortUrl,
  TeamActions,
  teamFeature,
} from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';

/**
 * A guard that fires the request to get a team and only proceeds if it completes.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns `true` after the team is retrieved.
 */
export const teamGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const store = inject(Store);

  const teamSlug = route.paramMap.get(ShortUrl.Team) as string;
  store.dispatch(TeamActions.getTeam({ slug: teamSlug }));

  return combineLatest([
    store.select(teamFeature.selectSelectedTeam),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(
      ([team, screenError]) => team?.team.slug !== teamSlug && !screenError
    ),
    take(1),
    map(() => true)
  );
};
