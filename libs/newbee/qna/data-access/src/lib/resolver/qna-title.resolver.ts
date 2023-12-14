import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ShortUrl, prependParentTitle } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectQnaAndScreenError } from '../store';

/**
 * A resolver to get the title for qna pages.
 *
 * @param route A snapshot of the route the user is trying to navigate to.
 *
 * @returns The name of the selected qna if one has been selected, 'Error' if for some reason one hasn't been.
 */
export const qnaTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
): Observable<string> => {
  const store = inject(Store);

  const qnaSlug = route.paramMap.get(ShortUrl.Qna) as string;

  return store.select(selectQnaAndScreenError).pipe(
    skipWhile(
      ({ selectedQna, screenError }) =>
        selectedQna?.qna.slug !== qnaSlug && !screenError,
    ),
    take(1),
    map(({ selectedQna }) =>
      prependParentTitle(route, selectedQna ? selectedQna.qna.title : 'Error'),
    ),
  );
};
