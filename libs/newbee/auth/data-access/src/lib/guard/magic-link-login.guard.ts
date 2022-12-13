import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';

/**
 * The route guard for the `magic-link-login` auth route.
 * Prevents users from accessing the link if they don't specify a token as a query parameter.
 *
 * @param route The snapshot of the route the user is trying to access.
 * @returns `true` if access is allowed, a `UrlTree` to redirect the user otherwise.
 */
export const magicLinkLoginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): boolean | UrlTree => {
  const router = inject(Router);
  const queryParamMap = route.queryParamMap;
  if (queryParamMap.has('token')) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
