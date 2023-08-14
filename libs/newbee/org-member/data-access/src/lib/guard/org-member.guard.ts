import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import {
  httpFeature,
  OrgMemberActions,
  orgMemberFeature,
  ShortUrl,
} from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';

/**
 * A guard that fires the request to get an org member and only proceeds if it completes.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns `true` after the org member is retrieved or an error is thrown.
 */
export const orgMemberGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const store = inject(Store);

  const orgMemberSlug = route.paramMap.get(ShortUrl.Member) as string;
  store.dispatch(OrgMemberActions.getOrgMember({ slug: orgMemberSlug }));

  return combineLatest([
    store.select(orgMemberFeature.selectSelectedOrgMember),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(
      ([orgMember, screenError]) =>
        orgMember?.orgMember.slug !== orgMemberSlug && !screenError
    ),
    take(1),
    map(() => true)
  );
};
