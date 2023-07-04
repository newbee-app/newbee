import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  httpFeature,
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';

/**
 * A resolver to get the title for org pages.
 *
 * @returns The name of the selected organization if one has been selected, 'Error' if for some reason one hasn't been.
 */
export const orgTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
): Observable<string> => {
  const store = inject(Store);
  const orgSlug = route.paramMap.get(UrlEndpoint.Organization) as string;
  store.dispatch(OrganizationActions.getOrg({ orgSlug }));
  return combineLatest([
    store.select(organizationFeature.selectSelectedOrganization),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(
      ([orgMember, screenError]) =>
        orgMember?.organization.slug !== orgSlug && !screenError
    ),
    take(1),
    map(([orgMember]) => {
      if (orgMember) {
        return orgMember.organization.name;
      }

      return 'Error';
    })
  );
};
