import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { authFeature, cookieFeature } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';

/**
 * A route guard that prevents users from accessing the link if the store contains user information (user is logged in).
 *
 * @returns `true` if access is allowed, a `UrlTree` to redirect the user otherwise.
 */
export const notAuthenticatedGuard: CanActivateFn = (): Observable<
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
        return router.createUrlTree(['/']);
      }

      return true;
    })
  );
};
