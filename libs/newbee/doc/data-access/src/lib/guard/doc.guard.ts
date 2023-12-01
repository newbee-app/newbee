import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { DocActions } from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectDocAndScreenError } from '../store';

/**
 * A guard that fires the request to get a doc and only proceeds if it completes.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns `true` after the doc is retrieved or an error is thrown.
 */
export const docGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean> => {
  const store = inject(Store);

  const docSlug = route.paramMap.get(ShortUrl.Doc) as string;
  store.dispatch(DocActions.getDoc({ slug: docSlug }));

  return store.select(selectDocAndScreenError).pipe(
    skipWhile(
      ({ selectedDoc, screenError }) =>
        selectedDoc?.doc.slug !== docSlug && !screenError,
    ),
    take(1),
    map(() => true),
  );
};
