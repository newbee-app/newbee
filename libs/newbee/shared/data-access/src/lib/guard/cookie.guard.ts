import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, skipWhile, take } from 'rxjs';
import { CookieActions, selectCsrfTokenAndScreenError } from '../store';

/**
 * A guard that fires the request to init cookies and only proceeds if it completes.
 *
 * @returns `true` after the cookies are initialized.
 */
export const cookieGuard: CanActivateFn = (): Observable<boolean> => {
  const store = inject(Store);

  store.dispatch(CookieActions.initCookies());

  return store.select(selectCsrfTokenAndScreenError).pipe(
    skipWhile(({ csrfToken, screenError }) => !csrfToken && !screenError),
    take(1),
    map(() => true),
  );
};
