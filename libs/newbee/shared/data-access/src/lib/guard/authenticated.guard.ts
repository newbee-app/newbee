import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { authFeature } from '../store';

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
    map((user) => {
      if (user) {
        return true;
      }

      return router.createUrlTree(['/auth/login']);
    })
  );
};
