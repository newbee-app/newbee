import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { TeamActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectTeamAndScreenError } from '../store';

/**
 * A guard that fires the request to get a team and only proceeds if it completes.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns `true` after the team is retrieved or an error is thrown.
 */
export const teamGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean> => {
  const store = inject(Store);

  const teamSlug = route.paramMap.get(ShortUrl.Team) as string;
  store.dispatch(TeamActions.getTeam({ slug: teamSlug }));

  return store.select(selectTeamAndScreenError).pipe(
    skipWhile(
      ({ selectedTeam, screenError }) =>
        selectedTeam?.team.slug !== teamSlug && !screenError,
    ),
    take(1),
    map(() => true),
  );
};
