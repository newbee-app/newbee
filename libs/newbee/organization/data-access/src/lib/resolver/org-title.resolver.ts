import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  httpFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';

/**
 * A resolver to get the title for org pages.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns The name of the selected organization if one has been selected, 'Error' if for some reason one hasn't been.
 */
export const orgTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
): Observable<string> => {
  const store = inject(Store);

  const orgSlug = route.paramMap.get(ShortUrl.Organization) as string;

  return combineLatest([
    store.select(organizationFeature.selectSelectedOrganization),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(
      ([selectedOrganization, screenError]) =>
        selectedOrganization?.slug !== orgSlug && !screenError
    ),
    take(1),
    map(([selectedOrganization]) => {
      if (selectedOrganization) {
        return selectedOrganization.name;
      }

      return 'Error';
    })
  );
};
