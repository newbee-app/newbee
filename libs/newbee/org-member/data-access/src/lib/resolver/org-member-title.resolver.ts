import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ShortUrl, prependParentTitle } from '@newbee/newbee/shared/util';
import { userDisplayName } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectOrgMemberAndScreenError } from '../store';

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

  return store.select(selectOrgMemberAndScreenError).pipe(
    skipWhile(
      ({ selectedOrgMember, screenError }) =>
        selectedOrgMember?.orgMember.slug !== orgMemberSlug && !screenError,
    ),
    take(1),
    map(({ selectedOrgMember }) => {
      return prependParentTitle(
        route,
        selectedOrgMember ? userDisplayName(selectedOrgMember.user) : 'Error',
      );
    }),
  );
};
