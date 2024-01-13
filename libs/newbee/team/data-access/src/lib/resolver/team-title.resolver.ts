import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ShortUrl, prependParentTitle } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectTeamAndScreenError } from '../store';

/**
 * A resolver to get the title for team pages.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 * @returns The name of the selected team if one has been selected, 'Error' if for some reason one hasn't been.
 */
export const teamTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
): Observable<string> => {
  const store = inject(Store);
  const teamSlug = route.paramMap.get(ShortUrl.Team) as string;
  return store.select(selectTeamAndScreenError).pipe(
    skipWhile(
      ({ selectedTeam, screenError }) =>
        selectedTeam?.team.slug !== teamSlug && !screenError,
    ),
    take(1),
    map(({ selectedTeam }) => {
      return prependParentTitle(
        route,
        selectedTeam ? selectedTeam.team.name : 'Error',
      );
    }),
  );
};
