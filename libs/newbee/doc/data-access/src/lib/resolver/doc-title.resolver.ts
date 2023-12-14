import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ShortUrl, prependParentTitle } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectDocAndScreenError } from '../store';

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

  return store.select(selectDocAndScreenError).pipe(
    skipWhile(
      ({ selectedDoc, screenError }) =>
        selectedDoc?.doc.slug !== docSlug && !screenError,
    ),
    take(1),
    map(({ selectedDoc }) =>
      prependParentTitle(route, selectedDoc ? selectedDoc.doc.title : 'Error'),
    ),
  );
};
