import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';
import { authFeature, cookieFeature } from '../store';

/**
 * The route guard for the home route.
 * Prevents users from accessing the link if the store doesn't contain user information (user is not logged in).
 *
 * @returns `true` if access is allowed, a `UrlTree` to redirect the user otherwise.
 */
export const authenticatedGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([
    store.select(authFeature.selectUser),
    store.select(cookieFeature.selectCsrfToken),
  ]).pipe(
    skipWhile(([, csrfToken]) => !csrfToken),
    take(1),
    map(([user]) => {
      if (user) {
        return true;
      }

      return router.createUrlTree([
        `/${UrlEndpoint.Auth}/${UrlEndpoint.Login}`,
      ]);
    })
  );
};
