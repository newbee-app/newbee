import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { selectUserAndCsrfToken } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';

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

  return store.select(selectUserAndCsrfToken).pipe(
    skipWhile(({ csrfToken }) => !csrfToken),
    take(1),
    map(({ user }) => {
      if (user) {
        return router.createUrlTree(['/']);
      }

      return true;
    }),
  );
};
