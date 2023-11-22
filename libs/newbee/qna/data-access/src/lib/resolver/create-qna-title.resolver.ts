import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { prependParentTitle } from '@newbee/newbee/shared/util';

/**
 * A resolver to get the title for the create QnA page.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns A title prepending the parent's title with `Create QnA`, unless the parent title shows an error.
 */
export const createQnaTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
): string => {
  return prependParentTitle(route, 'Create QnA');
};
