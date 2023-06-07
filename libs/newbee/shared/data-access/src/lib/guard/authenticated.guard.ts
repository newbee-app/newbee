import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { UrlEndpoint } from '@newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { filter, map, Observable, skipUntil } from 'rxjs';
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

  return store.select(authFeature.selectUser).pipe(
    // Wait until cookies are initialized before checking if the
    // user is authenticated.
    skipUntil(
      store
        .select(cookieFeature.selectCsrfToken)
        .pipe(filter((csrfToken) => !!csrfToken))
    ),
    map((user) => {
      if (user) {
        return true;
      }

      return router.createUrlTree([
        `/${UrlEndpoint.Auth}/${UrlEndpoint.Login}`,
      ]);
    })
  );
};
