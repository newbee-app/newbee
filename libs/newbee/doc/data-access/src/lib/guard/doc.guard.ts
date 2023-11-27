import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import {
  DocActions,
  docFeature,
  httpFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, skipWhile, take } from 'rxjs';

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

  return combineLatest([
    store.select(docFeature.selectSelectedDoc),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(
      ([doc, screenError]) => doc?.doc.slug !== docSlug && !screenError,
    ),
    take(1),
    map(() => true),
  );
};
