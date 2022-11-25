import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';

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
