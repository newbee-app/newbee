import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectUserAndCsrfToken } from '../store';

/**
 * A route guard that prevents users from accessing the link if the store doesn't contain user information (user is not logged in).
 *
 * @returns `true` if access is allowed, a `UrlTree` to redirect the user otherwise.
 */
export const authenticatedGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUserAndCsrfToken).pipe(
    skipWhile(({ csrfToken }) => !csrfToken),
    take(1),
    map(({ user }) => {
      if (user) {
        return true;
      }

      return router.createUrlTree([`/${Keyword.Auth}/${Keyword.Login}`]);
    }),
  );
};
