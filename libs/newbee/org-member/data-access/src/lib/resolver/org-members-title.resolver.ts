import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { prependParentTitle } from '@newbee/newbee/shared/util';

/**
 * A resolver to get the title for the org members page.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns A title prepending the parent's title with `Org members`, unless the parent title shows an error.
 */
export const orgMembersTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
): string => {
  return prependParentTitle(route, 'Org members');
};
