import {
  CanActivateFn,
  UrlTree,
  createUrlTreeFromSnapshot,
} from '@angular/router';
import { RouteAndQueryParams } from '@newbee/newbee/shared/util';

/**
 * A function that generates a guard designed to redirect a user to a path relative to the originally desired route.
 *
 * @param routeAndQueryParams The route and query params to use to redirect the user, relative to their originally desired route.
 *
 * @returns A guard that redirects the user.
 */
export function relativeRedirectGuard(
  routeAndQueryParams: RouteAndQueryParams,
): CanActivateFn {
  const { route, queryParams } = routeAndQueryParams;
  return (routeSnapshot): UrlTree => {
    return createUrlTreeFromSnapshot(routeSnapshot, [route], queryParams);
  };
}
