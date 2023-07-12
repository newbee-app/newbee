import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, skipWhile, take } from 'rxjs';
import { CookieActions, cookieFeature, httpFeature } from '../store';

/**
 * A guard that fires the request to init cookies and only proceeds if it succeeds.
 *
 * @returns `true` after the cookies are initialized.
 */
export const cookieGuard: CanActivateFn = (): Observable<boolean> => {
  const store = inject(Store);

  store.dispatch(CookieActions.initCookies());
  return combineLatest([
    store.select(cookieFeature.selectCsrfToken),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(([csrfToken, screenError]) => !csrfToken && !screenError),
    take(1),
    map(() => true)
  );
};
