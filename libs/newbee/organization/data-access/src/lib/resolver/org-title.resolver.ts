import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { organizationFeature } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

/**
 * A resolver to get the title for org pages.
 *
 * @returns The name of the selected organization if one has been selected, 'Org' if for some reason one hasn't been.
 */
export const orgTitleResolver: ResolveFn<string> = (): Observable<string> => {
  const store = inject(Store);

  return store.select(organizationFeature.selectSelectedOrganization).pipe(
    map((orgMember) => {
      return orgMember?.organization.name ?? 'Org';
    })
  );
};
