import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import {
  httpFeature,
  orgMemberFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl, prependParentTitle } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, skipWhile, take } from 'rxjs';

/**
 * A resolver to get the title for org member pages.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 * @returns The display name of the selected org member if one has been selected, 'Error' if for some reason one hasn't been.
 */
export const orgMemberTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
): Observable<string> => {
  const store = inject(Store);

  const orgMemberSlug = route.paramMap.get(ShortUrl.Member) as string;

  return combineLatest([
    store.select(orgMemberFeature.selectSelectedOrgMember),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(
      ([orgMember, screenError]) =>
        orgMember?.orgMember.slug !== orgMemberSlug && !screenError,
    ),
    take(1),
    map(([orgMember]) => {
      return prependParentTitle(
        route,
        orgMember ? orgMember.user.displayName ?? orgMember.user.name : 'Error',
      );
    }),
  );
};
