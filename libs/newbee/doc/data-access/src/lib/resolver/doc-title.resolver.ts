import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { docFeature, httpFeature } from '@newbee/newbee/shared/data-access';
import { ShortUrl, prependParentTitle } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, skipWhile, take } from 'rxjs';

/**
 * A resolver to get the title for doc pages.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns The name of the selected doc if one has been selected, 'Error' if for some reason one hasn't been.
 */
export const docTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
): Observable<string> => {
  const store = inject(Store);

  const docSlug = route.paramMap.get(ShortUrl.Doc) as string;

  return combineLatest([
    store.select(docFeature.selectSelectedDoc),
    store.select(httpFeature.selectScreenError),
  ]).pipe(
    skipWhile(
      ([doc, screenError]) => doc?.doc.slug !== docSlug && !screenError,
    ),
    take(1),
    map(([doc]) => prependParentTitle(route, doc ? doc.doc.title : 'Error')),
  );
};
