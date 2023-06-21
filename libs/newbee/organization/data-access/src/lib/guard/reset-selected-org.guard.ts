import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import {
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { map, Observable, skipWhile, take } from 'rxjs';

/**
 * A guard that fires the request to reset the selected org.
 * Only fires when the user is attempting to navigate away from the component it encompasses.
 *
 * @returns `true` after the selected org has been reset..
 */
export const resetSelectedOrgGuard: CanDeactivateFn<
  unknown
> = (): Observable<boolean> => {
  const store = inject(Store);
  store.dispatch(OrganizationActions.resetSelectedOrg());
  return store.select(organizationFeature.selectSelectedOrganization).pipe(
    skipWhile((selectedOrganization) => !!selectedOrganization),
    take(1),
    map(() => true)
  );
};
