import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { authFeature } from '../store';

/**
 * The route guard for the `confirm-email` auth route.
 * Prevents users from accessing the link if the store doesn't contain `jwtId` and `email` properties.
 *
 * @returns `true` if access is allowed, a `UrlTree` to redirect the user otherwise.
 */
export const confirmEmailGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(authFeature.selectAuthModuleState).pipe(
    take(1),
    map(({ jwtId, email }) => {
      if (jwtId && email) {
        return true;
      }

      return router.createUrlTree([`/${Keyword.Auth}/${Keyword.Login}`]);
    })
  );
};
