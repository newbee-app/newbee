import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectOrgAndScreenError } from '../store';

/**
 * A guard that fires the request to get an org and only proceeds if it completes.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns `true` after the org is retrieved.
 */
export const orgGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean> => {
  const store = inject(Store);

  const orgSlug = route.paramMap.get(ShortUrl.Organization) as string;
  store.dispatch(OrganizationActions.getOrg({ orgSlug }));

  return store.select(selectOrgAndScreenError).pipe(
    skipWhile(
      ({ selectedOrganization, screenError }) =>
        selectedOrganization?.organization.slug !== orgSlug && !screenError,
    ),
    take(1),
    map(() => true),
  );
};
