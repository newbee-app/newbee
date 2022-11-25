import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { authFeature } from '../store';

export const confirmEmailGuard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(authFeature.selectAuthState).pipe(
    map(({ jwtId, email }) => {
      if (jwtId && email) {
        return true;
      }

      return router.createUrlTree(['/auth/login']);
    })
  );
};
