import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  httpFeature,
  TeamActions,
  teamFeature,
} from '@newbee/newbee/shared/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';

/**
 * A resolver to get the title for team pages.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 * @returns The name of the selected team if one has been selected, 'Error' if for some reason one hasn't been.
 */
export const teamTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
): Observable<string> => {
  const store = inject(Store);
  const teamSlug = route.paramMap.get(UrlEndpoint.Team) as string;
  store.dispatch(TeamActions.getTeam({ slug: teamSlug }));
  return combineLatest([
    store.select(teamFeature.selectSelectedTeam),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(
      ([team, screenError]) => team?.team.slug !== teamSlug && !screenError
    ),
    take(1),
    map(([team]) => {
      const toAppend = route.parent ? ` - ${route.parent.title}` : '';
      if (team) {
        return `${team.team.name}${toAppend}`;
      }

      return `Error${toAppend}`;
    })
  );
};
