import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import {
  OrgMemberActions,
  orgMemberFeature,
} from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { map, Observable, skipWhile, take } from 'rxjs';

/**
 * A guard that fires the request to reset the selected org member.
 * Only fires when the org member is attempting to navigate away from the component it encompasses.
 *
 * @returns `true` after the selected org member has been reset.
 */
export const resetSelectedOrgMemberGuard: CanDeactivateFn<
  unknown
> = (): Observable<boolean> => {
  const store = inject(Store);
  store.dispatch(OrgMemberActions.resetSelectedOrgMember());
  return store.select(orgMemberFeature.selectSelectedOrgMember).pipe(
    skipWhile((selectedOrgMember) => !!selectedOrgMember),
    take(1),
    map(() => true)
  );
};
