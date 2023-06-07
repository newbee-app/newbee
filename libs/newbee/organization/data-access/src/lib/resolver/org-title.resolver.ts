import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { map, Observable, skipWhile } from 'rxjs';

/**
 * A resolver to get the title for org pages.
 *
 * @returns The name of the selected organization if one has been selected, 'Org' if for some reason one hasn't been.
 */
export const orgTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
): Observable<string> => {
  const store = inject(Store);

  const orgSlug = route.paramMap.get(UrlEndpoint.Organization) as string;
  store.dispatch(OrganizationActions.getOrg({ orgSlug }));

  return store.select(organizationFeature.selectSelectedOrganization).pipe(
    skipWhile((orgMember) => orgMember?.organization.slug !== orgSlug),
    map((orgMember) => {
      return orgMember?.organization.name as string;
    })
  );
};
