import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { OrgMemberActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectOrgMemberAndScreenError } from '../store';

/**
 * A guard that fires the request to get an org member and only proceeds if it completes.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns `true` after the org member is retrieved or an error is thrown.
 */
export const orgMemberGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean> => {
  const store = inject(Store);

  const orgMemberSlug = route.paramMap.get(ShortUrl.Member) as string;
  store.dispatch(OrgMemberActions.getOrgMember({ slug: orgMemberSlug }));

  return store.select(selectOrgMemberAndScreenError).pipe(
    skipWhile(
      ({ selectedOrgMember, screenError }) =>
        selectedOrgMember?.orgMember.slug !== orgMemberSlug && !screenError,
    ),
    take(1),
    map(() => true),
  );
};
